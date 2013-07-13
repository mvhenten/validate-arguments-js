var Random = {
    string: function(length) {
        length = length || 32;
        return Math.random().toString(36).substr(2, length);
    },

    number: function() {
        return Math.random() * 1000000;
    },


    integer: function() {
        return parseInt(Random.number(), 10);
    }
};

module.exports = Random;
