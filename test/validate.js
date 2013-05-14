var _ = require('lodash'),
    assert = require('assert'),
    format = require('util').format,
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

                assert.equal(valid.isValid(), false, 'invalid input is not valid');
            });

            assert.doesNotThrow(function() {
                var valid = Validate.validatePositional(values[0], values[1]);

                assert.equal(valid.isValid(), false, 'invalid input is not valid');
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
                label: 'Named arguments missing',
                args: {},
                spec: {},
                expect: 'missing named arguments'
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
                expect: 'missing named argumnent foo'
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
                expect: 'missing named argumnent foo, missing named argumnent biz'
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
                expect: 'named argument foo is not a "number", missing named argumnent biz'
            }
        ];

        cases.forEach(function(testCase) {
            var valid = Validate.validateObject(testCase.args, testCase.spec);
            assert.equal(valid.isValid(), false);
            assert.equal(valid.errorString(), testCase.expect);
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
});
