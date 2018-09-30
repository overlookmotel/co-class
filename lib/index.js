/* --------------------
 * co-class module
 * ------------------*/

'use strict';

// Modules
const co = require('co-simple'),
	isGeneratorFunction = require('is-generator').fn;

// Exports

/**
 * Wrap static and instance methods of class
 */
function wrapClass(klass, options) {
	wrapStatic(klass, options);
	wrapInstance(klass, options);
	return klass;
}

function wrapStatic(klass, options) {
	wrapGenerators(klass, options);
	return klass;
}

function wrapInstance(klass, options) {
	wrapGenerators(klass.prototype, options);
	return klass;
}

wrapClass.static = wrapStatic;
wrapClass.instance = wrapInstance;

module.exports = wrapClass;

/*
 * Wrapper
 * Wraps all own properties of object which are generators into coroutines.
 */
function wrapGenerators(obj, options) {
	const wrapper = (options && options.wrapper) || co; // jshint ignore:line

	const keys = Object.getOwnPropertyNames(obj);

	for (let key of keys) {
		const descriptor = Object.getOwnPropertyDescriptor(obj, key);
		if (descriptor.get || descriptor.set) continue;

		const value = obj[key];
		if (isGeneratorFunction(value)) obj[key] = wrapper(value);
	}
}
