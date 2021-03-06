const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const ngToolsWebpack = require('@ngtools/webpack');

module.exports = {
    entry: {
        'polyfills': './angularApp/polyfills.ts',
        'vendor': './angularApp/vendor.ts',
        'app': './angularApp/app/main-aot.ts'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        path: path.join(__dirname, 'wwwroot'),
        filename: 'js/[name].[hash:6].bundle.js',
        chunkFilename: 'js/[id].[hash:6].chunk.js',
    },
    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                use: '@ngtools/webpack'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(png|jpg|gif|ico|woff|woff2|ttf|svg|eot)$/,
                use: 'file-loader?name=assets/[name]-[hash:6].[ext]',
            },
            {
                test: /\.css$/,
                exclude: path.resolve(__dirname, "angularApp"),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader', use: [
                        { loader: 'css-loader', options: { minimize: true } }
                    ]
                })
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, "angularApp"),
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new ngToolsWebpack.AngularCompilerPlugin({
            tsConfigPath: './tsconfig-aot.json'
        }),
        new ExtractTextPlugin('css/[name]-[hash:6].bundle.css'),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),
        new CleanWebpackPlugin(
            [
                './wwwroot/js/',
                './wwwroot/css/',
                './wwwroot/assets/',
                './wwwroot/index.html'
            ]
        ),
        // inject in index.html
        new HtmlWebpackPlugin({
            template: './angularApp/index.html',
            inject: 'body',
            filename: 'index.html'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: false
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        })
    ]
};