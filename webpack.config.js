/* eslint-env node */

module.exports = env => {

    const webpack = require('webpack');

    const isDev = env.dev === true;

    let webpackConfig = {

        entry : {
            'dist/frontal.js' : __dirname + '/src/frontal.js'
        },

        output: {
            filename      : '[name]',
            libraryTarget : 'window'
        },

        resolve: {
            extensions: ['.js']
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
    }

    if (isDev) {

        webpackConfig.devtool = 'inline-sourcemap';
    }
    else {

        webpackConfig.plugins = [
            new webpack.optimize.UglifyJsPlugin({minimize: true})
        ];
    }

    return webpackConfig;
};
