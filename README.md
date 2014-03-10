validate-arguments-js
=====================

Validate arguments, declarative.

[![Build Status](https://drone.io/github.com/mvhenten/validate-arguments-js/status.png)](https://drone.io/github.com/mvhenten/validate-arguments-js/latest)

## Installation

```bash
    npm install validate-arguments
```

The code itself depends on `lodash`, and will propably run just fine in the browser using `require.js`.

## Documentation

This module levarages some of the validation methods from `lodash`, but by offering you a declaritive syntax and nice error strings:

* array
* boolean
* date
* element
* empty
* finite
* function
* null
* number
* object
* plainObject
* regexp
* string

And adds the following additional ones:

* whole ( An integer )
* real ( A real number that isn't NaN )
* natural ( Positive integer )
* primitive ( 'number', 'boolean', 'string' )

When passing a constructor (function) as an `isa`, an `instanceof` check is done.

```javascript
    var Validate = require('validate-arguments');
    
    function doSomething(withNamedArguments) {
        var args = Validate.named(arguments, {
            number: 'whole',
            name: 'string'
            callback: 'function'
            options: {
                isa: 'plainObject',
                optional: true
            },
            validation: Validate // performs an instanceof
        });
    
        if (!args.isValid()) {
            throw args.errorString();
        }
    
        // continue safely
    }
```
Look at the [test cases](https://github.com/mvhenten/validate-arguments-js/blob/master/test/validate.js) for more examples.

Node that validations may be nested:

```javascript
    var args = Validate.named(arguments, {
        address: {
            primary: {
                street: 'string',
                housenumber: 'number'
            }
        },
    });
```

## Methods

#### `named( named, validationSpec )`

Returns a `validationObject` for further inspection. `named` should be a non-empty plain `Object`, containing all the keys documented in the `validationSpec`.
The `validationSpec` should be an object, where the keys match the desired input. You may use the form `{ thing: 'string' }` over `{ thing: { isa: 'string' } }`.

When passed an `arguments` object instead of a plain object, the first key of the arguments is used.

#### `positional( arguments, ... )`

Validate positional arguments, either an array or arguments object. Spec may be provided as an array in the second argument, or a variable number of arguments.

#### `validate( arguments, ... )`

Validate arguments, freeform.

If the second argument contains a string, it is treated as a positional argument with one element.

### Return values

Both `validateObject` and `validatePositional` return a `validationObject` with the following methods:

* isValid: A boolean indication the validness
* errors: An array containing positions or keys of invalid arguments
* get: Retrieve values from the original input, array index or key
* values: Return an array of values ( not that usable )
* errorString: An error string explaining what went wrong (verbosely)

## Testing

```bash
cd validate-arguments-js
npm install
npm test
```

