// Tests for #2: support underscore.js
var mockery = require('mockery');

mockery.enable({
    // avoid hitting cached lodash
    useCleanCache: true,
    warnOnUnregistered: false
});

// Run the same tests with underscore now
mockery.registerSubstitute('lodash', 'underscore');
require('./validate');

mockery.disable();