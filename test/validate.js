var assert = require('assert'),
    random = require('./lib/random'),
    format = require('util').format,
    Validate = require('../');


suite('validate-arguments', function() {
    test('validate basic types', function(done) {


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
