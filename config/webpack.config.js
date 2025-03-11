'use strict';

const { merge } = require('webpack-merge');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const common = require('./webpack.common.js');
const PATHS = require('./paths');
const webpack = require('webpack')
const dotenv = require('dotenv')
dotenv.config()

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      contentScript: PATHS.src + '/contentScript.js',
      background: PATHS.src + '/background.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    resolve : {
      fallback: {
            // Use can only include required modules. Also install the package.
            // for example: npm install --save-dev assert
            url: require.resolve('url'),
            fs: require.resolve('fs'),
            assert: require.resolve('assert'),
            crypto: require.resolve('crypto-browserify'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            buffer: require.resolve('buffer'),
            stream: require.resolve('stream-browserify'),
            path: require.resolve("path-browserify") 
        }
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.MY_ENV': JSON.stringify(process.env.MY_ENV),
          'process.env.NODE_DEBUG': JSON.stringify(process.env.DOE_DEBUG),
          'process.env.VT_APIKEY': JSON.stringify(process.env.VT_APIKEY),
          'process.env.KP_APIKEY': JSON.stringify(process.env.KP_APIKEY)
        })
    ],
  });

  module.exports = config