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
function wrapClass(klass) {
	wrapStatic(klass);
	wrapInstance(klass);
	return klass;
}

function wrapStatic(klass) {
	wrapGenerators(klass);
	return klass;
}

function wrapInstance(klass) {
	wrapGenerators(klass.prototype);
	return klass;
}

wrapClass.static = wrapStatic;
wrapClass.instance = wrapInstance;

module.exports = wrapClass;

/*
 * Wrapper
 * Wraps all own properties of object which are generators into coroutines.
 */
function wrapGenerators(obj) {
	const keys = Object.getOwnPropertyNames(obj);

	for (let key of keys) {
		const descriptor = Object.getOwnPropertyDescriptor(obj, key);
		if (descriptor.get || descriptor.set) continue;

		const value = obj[key];
		if (isGeneratorFunction(value)) obj[key] = co(value);
	}
}
