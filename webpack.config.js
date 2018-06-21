const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: [
        './src/static/js/polyfills.js',
        './src/static/js/app.js'
    ],
    module : {
        rules : [
            {
                test : /\.js$/,
                exclude : /node_modules/,
                use : {
                    loader : 'babel-loader'
                }
            },
            {
                test : /\.vue$/,
                loader : 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins : [
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, 'src/static')
    }
};