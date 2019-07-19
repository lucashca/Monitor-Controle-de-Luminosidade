const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    externals: {
        fs: 'fs',
        child_process: 'child_process',
        bindings: 'bindings'
    }
};