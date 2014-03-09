/** Validate arguments: validate your args.
 * @module validate-arguments
 */
var _ = require('lodash'),
    ucfirst = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

/*jshint multistr: true */
var types = 'array boolean date element empty finite function null \
            number object plainObject regexp string'.match(/(\w+)/g),
    typeConstraints = {
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
            return typeConstraints.isWhole(value) && 0 <= value;
        }
    },
    _normalizeValidationSpec = function(validationSpec) {
        var normalized = {};

        _.each(validationSpec, function(value, key) {
            normalized[key] = _.extend({
                optional: false,
                isa: null
            }, _.isString(value) ? {
                isa: value
            } : value);
        });

        return normalized;
    },
    validationObject = function(invalidKeys, values, normalizedSpec) {
        return {
            isValid: function() {
                return invalidKeys.length === 0;
            },

            errors: function() {
                return invalidKeys;
            },

            get: function(name) {
                if (values) {
                    return values[name];
                }
                return null;
            },

            values: function() {
                if (_.isObject(values)) return _.values(values);
                if (_.isArray(values)) return values;

                return [];
            },

            errorString: function() {
                if (_.isEmpty(normalizedSpec)) {
                    return invalidKeys[0];
                }

                var prefix = _.isObject(values) ? 'named' : 'positional';

                var errors = _.map(invalidKeys, function(key) {
                    if (_.isEmpty(values[key]))
                        return 'missing ' + prefix + ' argument ' + key;

                    return prefix + ' argument ' + key + ' is not a "' + normalizedSpec[key].isa + '"';
                });

                return errors.length ? errors.join(', ') : '';
            }
        };
    };

var Validate = {
    /**
     * Perform validation against one of the builtin types: whole, real, natural
     *
     * @param {number} value A number to check
     * @param {string} typeName Type name: whole, real, natural
     * @return {bool} True or false, false if name is not one of "whole, real, natural"
     */
    isValidOfType: function(value, typeName) {
        var method = 'is' + ucfirst(typeName);

        if (typeConstraints[method] !== undefined) return typeConstraints[method](value);
        if (types.indexOf(typeName) === -1) return false;

        return _[method](value);
    },

    /**
     * Validate a single value against a given validation spec
     *
     * @param {any} value Value to validate
     * @param {object} rawSpec Validation spec { isa: 'what', optional: bool }
     * @return {bool} true or false
     */
    isValid: function(value, rawSpec) {
        var spec = _.extend({
                optional: false,
                isa: null
            }, rawSpec);


        if (_.isUndefined(value) || _.isNull(value)) {
            return spec.optional;
        }

        if (_.isString(spec.isa))
            return Validate.isValidOfType(value, spec.isa);

        if(  typeof spec.isa == 'function' )
            return (value instanceof spec.isa);

        return false;
    },

    /**
     * Validate positional arguments, either an array or arguments object.
     *
     * @param {array|arguments} posArguments Array or arguments object to validate
     * @param {array} validationSpec Validation spec (array of objects) to validate against
     * @return {validationObject} A validation object telling you what happened
     */
    validatePositional: function(posArguments, validationSpec) {
        var errors = [],
            normalized = _normalizeValidationSpec(validationSpec);

        if (_.isEmpty(validationSpec)) {
            return validationObject(['missing validation spec']);
        }


        if ((_.isArray(posArguments) || _.isArguments(posArguments))) {
            var validation = _.map( normalized, function(validation, index) {
                return Validate.isValid(posArguments[index], validation) ? null : index;
            });

            // filter out nulls
            errors = _.filter( validation, _.isNumber);

            return validationObject(errors, posArguments, normalized);
        }

        return validationObject(['missing positional arguments']);
    },

    /**
     * Validate named arguments, a plain object of key => value pairs
     *
     * @param {object} namedArguments Object of key => value pairs to validate
     * @param {object} validationSpec Validation spec ( key => validation ) to validate against
     * @return {validationObject} A validation object telling you what happened
     */
    validateObject: function(namedArguments, validationSpec) {
        var errors = [],
            normalized = _normalizeValidationSpec(validationSpec);

        if (_.isEmpty(validationSpec)) {
            return validationObject(['missing validation spec']);
        }

        if (_.isPlainObject(namedArguments)) {
            errors = _.filter(_.keys(validationSpec), function(key) {
                return !Validate.isValid(namedArguments[key], normalized[key]);
            });

            return validationObject(errors, namedArguments, normalized);
        }

        return validationObject(['missing named arguments']);
    }
};

module.exports = Validate;
