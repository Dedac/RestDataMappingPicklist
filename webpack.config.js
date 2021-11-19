const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const controlConfig = {
    entry: './src/index.tsx',
    mode: 'development',
    output: {
      filename: 'selector.js', 
    },
    devtool: 'inline-source-map',
    devServer: {
        server: 'https',
        port:44300
    },
    resolve: {
      extensions: ['.json', '.ts', '.tsx', '.js','.css'],
    },
    module: {
      rules: [
        { test: /\.json$/, use: 'json' },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'file-loader',
        },
      ],
    },
    optimization: {
      concatenateModules : true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/selector.html',
        filename: 'selector.html',        
      }),
      new CopyWebpackPlugin({
        patterns: [
            { from: "./node_modules/es6-promise/dist/es6-promise.min.js", to: "libs/es6-promise.min.js" },
            { from: "./node_modules/azure-devops-extension-sdk/SDK.min.js", to: "libs/SDK.min.js" },
            { from: "./img/Logo.png", to: "img/logo.png" },
            { from: "./src/RestSelector.css", to: "./" }, 
        ]
    })
    ],
  };

module.exports = [controlConfig];