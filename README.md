# co-class.js

# Async class methods with coroutines

## Current status

[![NPM version](https://img.shields.io/npm/v/co-class.svg)](https://www.npmjs.com/package/co-class)
[![Build Status](https://img.shields.io/travis/overlookmotel/co-class/master.svg)](http://travis-ci.org/overlookmotel/co-class)
[![Dependency Status](https://img.shields.io/david/overlookmotel/co-class.svg)](https://david-dm.org/overlookmotel/co-class)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/co-class.svg)](https://david-dm.org/overlookmotel/co-class)
[![Greenkeeper badge](https://badges.greenkeeper.io/overlookmotel/co-class.svg)](https://greenkeeper.io/)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/co-class/master.svg)](https://coveralls.io/r/overlookmotel/co-class)

## What's it for?

In versions of Node without `async/await` support, co-routines can be used to implement the same functionality using generator functions.

But defining class methods as co-routines is a pain. This module solves that problem.

## Usage

If you're on a version of Node that doesn't support `async/await`, instead of this code:

```js
class MyClass {
  async doSomethingAsync(a, b, c) {
    const res = await Promise.resolve(a * b * c);
    return res;
  }
}
```

...write this instead:

```js
const coClass = require('co-class');

const MyClass = coClass( class {
  *doSomethingAsync(a, b, c) {
    const res = yield Promise.resolve(a * b * c);
    return res;
  }
} );
```

### How it works

All class methods (both instance methods and static methods) which are generator functions are converted into co-routines.

Co-routines are equivalent to `async/await` syntax. Wrapping is performed using [co-simple](https://www.npmjs.com/package/co-simple).

`super` also works as you'd expect for calling methods on a super-class.

### Wrapping just instance or static methods

To wrap only static methods:

```js
coClass.static( klass );
```

To wrap on instance methods:

```js
coClass.instance( klass );
```

Calling `coClass( klass )` is equivalent to calling both the above methods.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookmotel/co-class/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/co-class/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add an entry to changelog
* add tests for new features
* document new functionality/API additions in README
