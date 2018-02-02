const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const isProd = process.env.NODE_ENV === 'production';

const jsPath = '/';

const plugins = [
    new HtmlWebpackPlugin({
        title: 'INDEX',
        filename: 'index.html',
        template: './src/index.html',
        inject: true,
        // chunks: [
        //     'index'
        // ],
        hash: true
    })
];

if (isProd) {
    plugins.push(new CleanWebpackPlugin(['./dist/*']));
} else {
    plugins.push(new webpack.NamedModulesPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

const config = {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },

    // entry: {
    //     index: './src/index.js',
    // },
    entry: ['react-hot-loader/patch', './src/index.js'],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
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
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ]
        }]
    },
    plugins: plugins
};

module.exports = config;