const path = require("path")
const {VueLoaderPlugin} = require("vue-loader")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    var isProduction = false
    if (argv.mode === "production") {
        isProduction = true;
    }

    var module = {
        entry: {"app": "./src/app.ts"},
        output: {
            path: path.resolve(__dirname, "./dist"),
            filename: "js/[name].js"
        },
        resolve: {
            extensions: [".ts", ".js", ".vue", ".css", ".scss"],
            alias: {
                vue$: "vue/dist/vue.esm.js",
                "@": path.join(__dirname, ".")
            }
        },
        devtool: isProduction ? "": "source-map",
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                    options: {
                        preserveWhitespace: false,
                        loaders: {
                            scss: "vue-style-loader!css-loader!sass-loader",
                        }
                    }
                },
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: "style-loader"
                        },
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(jpg|png|gif|jpeg)$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]"
                    }
                }
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template:path.join(__dirname,'./index.html'),
                filename:'index.html',
                hash: true
            }),
            new CopyWebpackPlugin([{
                from:__dirname+'/img',
                to:'.'
            }]),
        ]
    }

    if (isProduction) {
        module.plugins.push(new CleanWebpackPlugin())
        module.plugins.push(new UglifyJsPlugin({ uglifyOptions: { compress: true } }))
        module.plugins.push(new CompressionWebpackPlugin({ algorithm: 'gzip' }))
        module.optimization = { minimize: true }
    }

    return module;
}