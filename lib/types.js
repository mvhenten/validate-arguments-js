'use strict';

var _ = require('lodash');

var LODASH_HELPERS = [
    'isArray',
    'isBoolean',
    'isDate',
    'isElement',
    'isEmpty',
    'isFinite',
    'isFunction',
    'isNull',
    'isNumber',
    'isObject',
    'isRegexp',
    'isString',
];

var Types = {
    isWhole: function(value) {
        // a whole nunmber ( int )
        return _.isNumber(value) && value % 1 === 0;
    },
    isReal: function(value) {
        // a real number ( float )
        return _.isNumber(value) && !isNaN(value);
    },
    isNatural: function(value) {
        // e.g. positive int
        return Types.isWhole(value) && 0 <= value;
    },

    isPlainObject: function(value) {
        return _.isObject(value) && !_.isArray(value) && !_.isFunction(value);
    },

    isPrimitive: function(value) {
        return _.indexOf(['number', 'boolean', 'string'], value) !== -1;
    }
};

// expose lodash type checks
_.each(LODASH_HELPERS, function(name) {
    Types[name] = _[name];
});

module.exports = Types;
