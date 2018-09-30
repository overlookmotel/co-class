/* --------------------
 * co-class module
 * Tests
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	{expect} = chai,
	chaiAsPromised = require('chai-as-promised'),
	Bluebird = require('bluebird'),
	coClass = require('../lib/');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);

// Tests

/* jshint expr: true */
/* global describe, it, beforeEach */

function makeClass() {
	class RootKlass {
		subclassedInstanceMethod() {
			return 56;
		}

		static subclassedStaticMethod() {
			return 78;
		}
	}

	class Klass extends RootKlass {
		*asyncInstanceMethod(a, b) {
			return yield Promise.resolve(a + b);
		}

		static *asyncStaticMethod(a, b) {
			return yield Promise.resolve(a + b);
		}

		syncInstanceMethod(a, b) {
			return a + b;
		}

		static syncStaticMethod(a, b) {
			return a + b;
		}

		*subclassedInstanceMethod() {
			return super.subclassedInstanceMethod();
		} // jshint ignore:line

		static *subclassedStaticMethod() {
			return super.subclassedStaticMethod();
		} // jshint ignore:line
	}

	Klass.prototype.instanceProp = 12;
	Klass.staticProp = 34;

	return Klass;
}

describe('coClass()', function() {
	beforeEach(function() {
		const Klass = makeClass();
		this.originalKlass = Klass;
		this.Klass = coClass(Klass);
		this.instance = new Klass();
	});

	it('returns input', function() {
		expect(this.Klass).to.equal(this.originalKlass);
	});

	describe('wraps instance methods', function() {
		it('to function', function() {
			const {instance} = this;
			expect(instance.asyncInstanceMethod).to.be.a('function');
		});

		it('function returns promise', function() {
			const {instance} = this;
			const p = instance.asyncInstanceMethod(3, 4);
			expect(p).to.be.instanceof(Promise);
			return expect(p).to.eventually.equal(7);
		});

		it('maintains `super` relationship', function() {
			const {instance} = this;
			const p = instance.subclassedInstanceMethod();
			return expect(p).to.eventually.equal(56);
		});
	});

	describe('wraps static methods', function() {
		it('to function', function() {
			const {Klass} = this;
			expect(Klass.asyncStaticMethod).to.be.a('function');
		});

		it('function returns promise', function() {
			const {Klass} = this;
			const p = Klass.asyncStaticMethod(3, 4);
			expect(p).to.be.instanceof(Promise);
			return expect(p).to.eventually.equal(7);
		});

		it('maintains `super` relationship', function() {
			const {Klass} = this;
			const p = Klass.subclassedStaticMethod();
			return expect(p).to.eventually.equal(78);
		});
	});

	describe('leaves unchanged', function() {
		it('instance methods', function() {
			const {instance} = this;
			expect(instance.syncInstanceMethod).to.be.a('function');
			expect(instance.syncInstanceMethod(3, 4)).to.equal(7);
		});

		it('static methods', function() {
			const {Klass} = this;
			expect(Klass.syncStaticMethod).to.be.a('function');
			expect(Klass.syncStaticMethod(3, 4)).to.equal(7);
		});

		it('instance properties', function() {
			const {instance} = this;
			expect(instance.instanceProp).to.equal(12);
		});

		it('static properties', function() {
			const {Klass} = this;
			expect(Klass.staticProp).to.equal(34);
		});
	});
});

describe('coClass.static()', function() {
	beforeEach(function() {
		const Klass = makeClass();
		this.originalKlass = Klass;
		this.Klass = coClass.static(Klass);
		this.instance = new Klass();
	});

	it('returns input', function() {
		expect(this.Klass).to.equal(this.originalKlass);
	});

	describe('wraps static methods', function() {
		it('to function', function() {
			const {Klass} = this;
			expect(Klass.asyncStaticMethod).to.be.a('function');
		});

		it('function returns promise', function() {
			const {Klass} = this;
			const p = Klass.asyncStaticMethod(3, 4);
			expect(p).to.be.instanceof(Promise);
			return expect(p).to.eventually.equal(7);
		});

		it('maintains `super` relationship', function() {
			const {Klass} = this;
			const p = Klass.subclassedStaticMethod();
			return expect(p).to.eventually.equal(78);
		});
	});

	describe('leaves unchanged', function() {
		it('instance methods', function() {
			const {instance} = this;
			expect(instance.syncInstanceMethod).to.be.a('function');
			expect(instance.syncInstanceMethod(3, 4)).to.equal(7);
		});

		it('instance generator methods', function() {
			const {instance} = this;
			expect(instance.asyncInstanceMethod).to.be.a('function');
			const res = instance.asyncInstanceMethod();
			expect(res.next).to.be.a('function');
			expect(res.throw).to.be.a('function');
		});

		it('static methods', function() {
			const {Klass} = this;
			expect(Klass.syncStaticMethod).to.be.a('function');
			expect(Klass.syncStaticMethod(3, 4)).to.equal(7);
		});

		it('instance properties', function() {
			const {instance} = this;
			expect(instance.instanceProp).to.equal(12);
		});

		it('static properties', function() {
			const {Klass} = this;
			expect(Klass.staticProp).to.equal(34);
		});
	});
});

describe('coClass.instance()', function() {
	beforeEach(function() {
		const Klass = makeClass();
		this.originalKlass = Klass;
		this.Klass = coClass.instance(Klass);
		this.instance = new Klass();
	});

	it('returns input', function() {
		expect(this.Klass).to.equal(this.originalKlass);
	});

	describe('wraps instance methods', function() {
		it('to function', function() {
			const {instance} = this;
			expect(instance.asyncInstanceMethod).to.be.a('function');
		});

		it('function returns promise', function() {
			const {instance} = this;
			const p = instance.asyncInstanceMethod(3, 4);
			expect(p).to.be.instanceof(Promise);
			return expect(p).to.eventually.equal(7);
		});

		it('maintains `super` relationship', function() {
			const {instance} = this;
			const p = instance.subclassedInstanceMethod();
			return expect(p).to.eventually.equal(56);
		});
	});

	describe('leaves unchanged', function() {
		it('instance methods', function() {
			const {instance} = this;
			expect(instance.syncInstanceMethod).to.be.a('function');
			expect(instance.syncInstanceMethod(3, 4)).to.equal(7);
		});

		it('static methods', function() {
			const {Klass} = this;
			expect(Klass.syncStaticMethod).to.be.a('function');
			expect(Klass.syncStaticMethod(3, 4)).to.equal(7);
		});

		it('static generator methods', function() {
			const {Klass} = this;
			expect(Klass.asyncStaticMethod).to.be.a('function');
			const res = Klass.asyncStaticMethod();
			expect(res.next).to.be.a('function');
			expect(res.throw).to.be.a('function');
		});

		it('instance properties', function() {
			const {instance} = this;
			expect(instance.instanceProp).to.equal(12);
		});

		it('static properties', function() {
			const {Klass} = this;
			expect(Klass.staticProp).to.equal(34);
		});
	});
});

describe('wrapper option', function() {
	beforeEach(function() {
		const Klass = makeClass();
		this.originalKlass = Klass;
		this.Klass = coClass(Klass, {wrapper: Bluebird.coroutine});
		this.instance = new Klass();
	});

	describe('wraps instance methods with specified wrapper', function() {
		it('to function', function() {
			const {instance} = this;
			expect(instance.asyncInstanceMethod).to.be.a('function');
		});

		it('function returns promise', function() {
			const {instance} = this;
			const p = instance.asyncInstanceMethod(3, 4);
			expect(p).to.be.instanceof(Bluebird);
			return expect(p).to.eventually.equal(7);
		});
	});

	describe('wraps static methods with specified wrapper', function() {
		it('to function', function() {
			const {Klass} = this;
			expect(Klass.asyncStaticMethod).to.be.a('function');
		});

		it('function returns promise', function() {
			const {Klass} = this;
			const p = Klass.asyncStaticMethod(3, 4);
			expect(p).to.be.instanceof(Bluebird);
			return expect(p).to.eventually.equal(7);
		});
	});
});
