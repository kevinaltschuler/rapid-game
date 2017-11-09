const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "styles.css"
});

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js',
        publicPath: 'http://localhost:8080/'
    },
    devtool: 'source-map', 
    module: {
        rules: [
          {
            test: /\.(js)$/,
            loaders: 'babel-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: 'css-loader'
            })
          },
          {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
              use: ['css-loader', 'sass-loader']
            })
          }
        ]
    },
    resolve: {
        alias: {
            'react': 'inferno-compat',
            'react-dom': 'inferno-compat'
        }
    },
    devServer: {
        contentBase: './',
        port: 8080,
        noInfo: false,
        hot: true,
        inline: true,
        proxy: {
            '/': {
                bypass: function (req, res, proxyOptions) {
                    return '/public/index.html';
                }
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        extractSass
    ]
};
