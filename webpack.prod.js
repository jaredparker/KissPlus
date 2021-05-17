
const { merge } = require('webpack-merge');
const common    = require('./webpack.common.js');

const fs = require('fs');

// FORKED FROM: https://github.com/webpack/webpack-cli/issues/312#issuecomment-732749280
class BannerPlugin {
    constructor( options ) {
        this.banner = options.banner;
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync( 'FileListPlugin', ( compilation, callback ) => {
            compilation.chunks.forEach( chunk => {
                chunk.files.forEach( filename => {
                    const asset  = compilation.assets[ filename ];
                    asset._value = `${this.banner}\n\n${asset._value}`; // append banner with line spacing
                });
            });
            callback();
        });
    }
}

module.exports = merge( common, {

    mode: 'production',
    plugins: [
        new BannerPlugin({
            banner: fs.readFileSync('./src/metadata.js', 'utf8')
        })
    ]
});