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