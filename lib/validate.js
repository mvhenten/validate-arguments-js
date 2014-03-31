/** Validate arguments: validate your args.
 * @module validate-arguments
 */
'use strict';

var _ = require('lodash'),
    sliced = require('sliced'),
    ucfirst = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

var Types = require('./types');

function _normalizeSpec(spec) {
    return _.reduce(spec, function(spec, value, key) {
        if (!value.isa) {
            if (Types.isPlainObject(value)) {
                value = _normalizeSpec(value);
            }

            value = {
                isa: value
            };
        }

        spec[key] = value;
        return spec;
    }, {});
}

function _formatError(prefix, value, key, type) {
    if (_.isEmpty(value))
        return 'missing ' + prefix + ' argument ' + key;

    return prefix + ' argument ' + key + ' is not a "' + type + '"';
}


var validationObject = function(invalidKeys, values, spec) {
    return {
        isValid: function() {
            return invalidKeys.length === 0;
        },

        errors: function() {
            return invalidKeys;
        },

        get: function(name) {
            if (values) return values[name];
            return null;
        },

        values: function() {
            if (_.isObject(values)) return _.values(values);
            if (_.isArray(values)) return values;

            return [];
        },

        errorString: function() {
            var prefix = _.isObject(values) ? 'named' : 'positional';

            if (_.isEmpty(spec)) return invalidKeys[0];

            return _.map(invalidKeys, function(key) {
                return _formatError(prefix, values[key], key, spec[key].isa);
            }).join(', ');
        }
    };
};

var Validate = {
    /**
     * Perform validation against one of the builtin types: whole, real, natural
     *
     * @param {number} value A number to check
     * @param {string} name Type name: whole, real, natural
     * @return {bool} True or false, false if name is not one of "whole, real, natural"
     */
    isValidOfType: function(value, typeName) {
        var method = 'is' + ucfirst(typeName);

        if (Types[method] === undefined) return false;
        return Types[method](value);
    },

    /**
     * Validate a single value against a given validation spec
     *
     * @param {any} value Value to validate
     * @param {object} Validation spec { isa: 'what', optional: bool }
     * @return {bool} true or false
     */
    isValid: function(value, spec) {
        if (_.isUndefined(value) || _.isNull(value))
            return spec.optional;

        if (_.isString(spec.isa))
            return Validate.isValidOfType(value, spec.isa);

        if (Types.isPlainObject(spec.isa))
            return Validate.validate(value, spec.isa).isValid();

        if (typeof spec.isa === 'function')
            return (value instanceof spec.isa);

        return false;
    },

    /**
     * Validate positional arguments, either an array or arguments object.
     *
     * @deprecated This method is now replaced by Validate.positional
     */
    validatePositional: function(values, spec) {
        return Validate.positional(values, spec);
    },

    /**
     * Validate named arguments, a plain object of key => value pairs
     *
     * @deprecated This method is now replaced by Validate.named
     */
    validateObject: function(values, spec) {
        return Validate.named(values, spec);
    },

    /**
     * Validate arguments, freeform.
     *
     * If the second argument contains a string, it is treated as a positional argument
     * with one element.
     *
     * @param {object|array|arguments} named Object of key => value pairs, or an arguments object
     * @param {object} spec Simplified validation spec
     * @return {validationObject} A validation object telling you what happened
     */
    validate: function(values, spec) {
        var errors = [];

        if (_.isEmpty(spec)) return validationObject(['missing validation spec']);
        if (!values instanceof Object) return validationObject(['invalid values']);
        if (Types.isPrimitive(spec)) return Validate.positional(values, [spec]);

        spec = _normalizeSpec(spec);

        errors = _.reduce(spec, function(errors, validation, key) {
            if (!Validate.isValid(values[key], validation)) {
                errors.push(key);
            }

            return errors;
        }, []);

        return validationObject(errors, values, spec);
    },

    /**
     * Validate named arguments, allows omitting the "isa" key when not needed
     *
     * @param {object} named Object of key => value pairs, or an arguments object
     * @param {object} spec Simplified validation spec
     * @return {validationObject} A validation object telling you what happened
     */
    named: function(named, spec) {
        if (!Types.isPlainObject(named))
            return validationObject(['missing named arguments']);

        if (_.isArguments(named)) named = named[0];

        return Validate.validate(named, spec);
    },

    /**
     * Validate positional arguments, either an array or arguments object.
     * Spec may be provided as an array in the second argument, or a variable number
     * of arguments.
     *
     * @param {array|arguments} values Array or arguments object to validate
     * @param {array|spec|...} spec Validation spec (array of objects) to validate against
     * @return {validationObject} A validation object telling you what happened
     */
    positional: function(values, spec) {
        if (!(_.isArray(values) || _.isArguments(values)))
            return validationObject(['missing positional arguments']);

        if (!_.isArray(spec)) {
            spec = sliced(arguments, 1);
        }

        return Validate.validate(values, spec);
    }
};

module.exports = Validate;
