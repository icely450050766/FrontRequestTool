const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: () => {
        return {
            index: './index.js'
        }
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, './dist'),
        publicPath: "/"
    },
    module: {
        rules: [
            {
                // 用正则匹配要用 该loader转换 的css文件
                test: /\.css$/,
                loaders: ExtractTextPlugin.extract({
                    use: ['style-loader', 'css-loader']
                })
            },
            {
                test: /\.scss$/,
                // 这里用了样式分离出来的插件，还要开放注释 plugins new ExtractTextPlugin
                // loader: ExtractTextPlugin.extract({
                //     use: ['css-loader', 'sass-loader']
                // })
                // 如果不想分离出来，可以直接这样写
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }],
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'dist')
                ]
            }
        ]
    },
    plugins: [
        // new ExtractTextPlugin({
        //     filename: `[name].css`
        // }),
    ]
}

