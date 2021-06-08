
module.exports = {

    entry: './src/index.js',
    output: {
        path: `${__dirname}/build`,
        filename: 'kissplus.jaredparker.js',
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [

                    // Load css for import
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:8]'
                            },
                            url: false
                        }
                    },

                    // Auto prefix (see postcss.config.js)
                    'postcss-loader',

                    // Compile sass into css
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: 'compressed'
                            }
                        },
                    },
                ],
            },
        ],
    }
};