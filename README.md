validate-arguments-js
=====================

Validate arguments, declarative.

This module levarages some of the validation methods from `lodash`:

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

When passing a constructor (function) as an `isa`, an `instanceof` check is done.

But by offering you a declaritive syntax and nice error strings:

```javascript
    var Validate = require('validate-arguments');
    
    function doSomething(withNamedArguments) {
        var args = Validate.validateObject(arguments[0], {
            number: {
                isa: 'whole'
            },
            name: {
                isa: 'string'
            },
            callback: {
                isa: 'function'
            },
            options: {
                isa: 'plainObject',
                optional: true
            },
            validation: {
                isa: Validate
            }
        });
    
        if (!args.isValid()) {
            throw args.errorString();
        }
    
        // continue safely
    }
```
Look at the [test cases](https://github.com/mvhenten/validate-arguments-js/blob/master/test/validate.js) for more examples.

## Methods

### `validateObject( namedArguments, validationSpec )`

Returns a `validationObject` for further inspection. `namedArguments` should be a non-empty plain `Object`, containing all the keys documented in the `validationSpec`, matching their `isa`.

The `validationSpec` should be an object, where the keys match the desired input, pointing to an object with at least one key `isa`.

### `validateObject( positionalArguments, validationSpec )`

Returns a `validationObject` for further inspection. `positionalArguments` should be a non-empty plain `Array`, containing values matching values in the `validationSpec`.

The `validationSpec` should be an array of objects, each with at least one key `isa`.

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
## Contributing

Contributions are welcome, preferably in the form of:

* a pull request adding a feature or fixing a bug
* a regression test or feature test showing off the new code

Please use the `./beautify.sh` script before commiting!