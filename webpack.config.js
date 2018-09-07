/* eslint-env node */

const webpack = require('webpack');

module.exports = {

    entry : {
        'dist/frontal.jquery.js' : __dirname + '/src/frontal.jquery.js',
        'dist/frontal.native.js' : __dirname + '/src/frontal.native.js'
    },

    output: {
        filename      : '[name]',
        libraryTarget : 'window'
    },

    resolve: {
        extensions: ['.js']
    },

    plugins: [
       new webpack.optimize.UglifyJsPlugin({minimize: true}),
    ],

    externals: {
        jquery: 'jQuery'
    },

    module: {
        loaders: [{
            test : /\.js$/,
            exclude: /node_modules/,
            loader : 'babel-loader',
            query: {
                presets : ['env']
            }
        }]
    }
};
