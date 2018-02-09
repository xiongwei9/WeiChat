const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const jsPath = '/';

const plugins = [
    new HtmlWebpackPlugin({
        title: 'INDEX',
        filename: 'index.html',
        template: './src/index.html',
        inject: true,
        chunks: [
            'index'
        ],
        hash: true
    })
];

if (isProd) {
    plugins.push(new CleanWebpackPlugin(['./dist/*']));
    plugins.push(new ExtractTextPlugin('[name].css'));
    plugins.push(new UglifyjsWebpackPlugin({
        sourceMap: false,
    }));
} else {
    plugins.push(new webpack.NamedModulesPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

const config = {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        host: '0.0.0.0',  // can be accessed by other hosts
        proxy: {
            '/api': 'http://localhost:8081'
        }
    },

    entry: {
        index: ['react-hot-loader/patch', './src/index.js'],
    },
    // entry: ['react-hot-loader/patch', './src/index.js'],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: isProd ? jsPath : '/',
    },

    module: {
        rules: [{
            test: /\.jsx?$/,
            use: [
                // 'react-hot-loader/webpack',
                'babel-loader',
            ],
            exclude: /node_modules/
        }, {
            test: /\.(css|scss)$/,
            use: isProd ? ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: true,
                    }
                }, {
                    loader: 'sass-loader'
                }],
                fallback: 'style-loader',
            }) : [
                'style-loader',
                'css-loader',
                'sass-loader',
            ],
            exclude: /node_modules/
        }]
    },
    plugins: plugins
};

module.exports = config;