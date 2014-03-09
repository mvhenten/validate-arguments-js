'use strict';

var _ = require('lodash'),
    assert = require('assert'),
    random = require('./lib/random'),
    Validate = require('../');


suite('validate-arguments', function() {
    test('Validate must be gracefull about bad input', function(done) {
        var cases = [
            {
                'functions': [

                    function() {},

                    function() {}]
            },
            {
                'null and null': [null, null]
            },
            {
                'empty objects': [{}, {}]
            },
            {
                'empty arrays': [[], []]
            },
            {
                'undefs': []
            },
        ];

        cases.forEach(function(testCase) {
            var label = _.first(_.keys(testCase)),
                values = testCase[label];

            assert.ok(label && values, 'we have a case');

            assert.doesNotThrow(function() {
                var valid = Validate.validateObject(values[0], values[1]);

                assert.equal(valid.isValid(), false, 'invalid input is not valid: ' + label);
            });

            assert.doesNotThrow(function() {
                var valid = Validate.validatePositional(values[0], values[1]);

                assert.equal(valid.isValid(), false, 'invalid input is not valid: ' + label);
            });
        });

        done();
    });

    test('Validate returns a validationObject', function(done) {
        var value = random.string(),
            valid = Validate.validateObject({
                str: value
            }, {
                str: {
                    isa: 'string'
                }
            });

        assert.ok(valid.isValid(), 'isValid returns a true value');
        assert.equal(valid.get('str'), value, 'get returns expected value');
        assert.equal(valid.errorString(), '', 'Error string is an empty string');
        assert.deepEqual(valid.errors(), [], 'Errors is an emtpy array');
        assert.deepEqual(valid.values(), [value], 'Values returns the values of the object');

        valid = Validate.validatePositional([value], [{
            isa: 'string'
            }]);

        assert.ok(valid.isValid(), 'isValid returns a true value');
        assert.equal(valid.get(0), value, 'get returns expected value');
        assert.equal(valid.errorString(), '', 'Error string is an empty string');
        assert.deepEqual(valid.errors(), [], 'Errors is an emtpy array');
        assert.deepEqual(valid.values(), [value], 'Values returns the values of the object');

        done();
    });

    test('Validate returns a meaning ful errorString', function(done) {
        var value = random.string();

        var cases = [
            {
                label: 'Validation spec missing',
                args: {},
                spec: {},
                expect: 'missing validation spec'
            },
            {
                label: 'Missing arguments',
                args: {
                    bar: 1
                },
                spec: {
                    foo: {
                        isa: 'string'
                    }
                },
                expect: 'missing named argument foo'
            },
            {
                label: 'Multiple missing arguments',
                args: {
                    bar: 1
                },
                spec: {
                    foo: {
                        isa: 'string'
                    },
                    biz: {
                        isa: 'number'
                    }
                },
                expect: 'missing named argument foo, missing named argument biz'
            },
            {
                label: 'Named argument is not a',
                args: {
                    foo: value
                },
                spec: {
                    foo: {
                        isa: 'number'
                    }
                },
                expect: 'named argument foo is not a "number"'
            },
            {
                label: 'Mixing errors',
                args: {
                    foo: value
                },
                spec: {
                    foo: {
                        isa: 'number'
                    },
                    biz: {
                        isa: 'string'
                    }
                },
                expect: 'named argument foo is not a "number", missing named argument biz'
            }
        ];

        cases.forEach(function(testCase) {
            var valid = Validate.validateObject(testCase.args, testCase.spec);

            assert.equal(valid.isValid(), false, 'not valid: ' + testCase.label);
            assert.equal(valid.errorString(), testCase.expect, 'errors: ' + testCase.label);
        });

        done();
    });

    test('validate basic types', function(done) {
        // todo generalize test cases for types
        var cases = [{
                label: 'boolean true is a boolean',
                value: true,
                spec: {
                    isa: 'boolean'
                },
                expect: true
            }, {
                label: 'boolean false is a boolean',
                value: false,
                spec: {
                    isa: 'boolean'
                },
                expect: true
            }, {
                label: 'stringy true is not a boolean',
                value: 'true',
                spec: {
                    isa: 'boolean'
                },
                expect: false
            }, {
                label: 'a random int number is a number',
                value: random.integer(),
                spec: {
                    isa: 'number'
                },
                expect: true
            }, {
                label: 'a random float number is a number',
                value: random.number(),
                spec: {
                    isa: 'number'
                },
                expect: true
            }, {
                label: 'a random int number is a finite number',
                value: random.integer(),
                spec: {
                    isa: 'finite'
                },
                expect: true
            }, {
                label: 'a random float number is not a whole number',
                value: random.number(),
                spec: {
                    isa: 'whole'
                },
                expect: false
            }, {
                label: 'a string is not a whole number',
                value: random.string(),
                spec: {
                    isa: 'whole'
                },
                expect: false
            }, {
                label: 'a random int is a whole number',
                value: random.integer(),
                spec: {
                    isa: 'whole'
                },
                expect: true
            }, {
                label: 'a random negative int is not a natural number',
                value: random.integer() * -1,
                spec: {
                    isa: 'natural'
                },
                expect: false
            }, {
                label: 'a zero is a natural number',
                value: 0,
                spec: {
                    isa: 'whole'
                },
                expect: true
            }
        ];

        cases.forEach(function(testCase) {
            var value = {
                key: testCase.value
            }, spec = {
                    key: testCase.spec
                };

            var validated = Validate.validateObject(value, spec);
            assert.equal(validated.isValid(), testCase.expect, testCase.label);

        });

        assert.ok(true, 'all is well');
        done();
    });

    test('optionals can be emtpy', function(done) {
        var undef, values = [{
                thing: null
                }, {
                thing: undef
                }, {}];

        var spec = {
            thing: {
                isa: 'plainObject',
                optional: true
            }
        };

        values.map(function(value) {
            var validated = Validate.validateObject({}, spec);

            assert.equal(validated.isValid(), true, 'optional arguments may be omitted: ' + value.thing);
        });

        done();


    });

    test('validation specs can be nested', function() {
        // TODO add more testcases, both invalid and valid!

        var spec = {
            thing: {
                isa: {
                    nestedThing: {
                        isa: {
                            childOfNested: {
                                isa: 'string'
                            }
                        }
                    },
                    optionalThing: {
                        optional: true,
                        isa: 'string'
                    }
                },
                optional: true
            }
        };

        var cases = [
            {
                label: 'deep nested object is validated',
                isValid: true,
                value: {
                    thing: {
                        nestedThing: {
                            childOfNested: random.string()
                        }
                    }
                }
            },
            {
                label: 'deep nested value must be of valid type',
                isValid: false,
                value: {
                    thing: {
                        nestedThing: {
                            childOfNested: random.integer()
                        }
                    }
                }
            }
        ];

        cases.map(function(testCase) {
            var validated = Validate.validateObject(testCase.value, spec);

            assert.equal(validated.isValid(), testCase.isValid, testCase.label);
        });
    });


    test('Validate.named is sugar for validateObject', function() {
        var cases = [
            {
                label: 'Validate.named simple',
                spec: {
                    name: 'string'
                },
                input: {
                    name: random.string()
                },
                expect: true,
            },
            {
                label: 'Validate.named validates',
                spec: {
                    name: 'string'
                },
                input: {
                    name: random.integer()
                },
                expect: false,
            },
            {
                label: 'Validate.named allows isa',
                spec: {
                    name: {
                        isa: 'string'
                    }
                },
                input: {
                    name: random.string()
                },
                expect: true,
            },
            {
                label: 'Validate.named allows nesting',
                spec: {
                    name: {
                        foo: {
                            bar: 'string'
                        }
                    }
                },
                input: {
                    name: {
                        foo: {
                            bar: random.string()
                        }
                    }
                },
                expect: true,
            },
            {
                label: 'Validate.named allows nesting complexer objects',
                spec: {
                    name: {
                        biz: {
                            bar: 'string'
                        },
                        foo: {
                            bar: 'string'
                        }
                    }
                },
                input: {
                    name: {
                        biz: {
                            bar: random.string()
                        },
                        foo: {
                            bar: random.string()
                        }
                    }
                },
                expect: true,
            },
            {
                label: 'Validate.named validates nested complexer objects',
                spec: {
                    name: {
                        biz: {
                            bar: 'string'
                        },
                        foo: {
                            bar: 'number'
                        }
                    }
                },
                input: {
                    name: {
                        biz: {
                            bar: random.string()
                        },
                        foo: {
                            bar: random.string()
                        }
                    }
                },
                expect: false,
            }
        ];

        _.each(cases, function(testCase) {
            var validated = Validate.named(testCase.input, testCase.spec);

            assert.equal(validated.isValid(), testCase.expect);

        });

    });
});
