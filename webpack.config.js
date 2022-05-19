const path = require("path")
const webpack = require("webpack")

module.exports = {
    mode: 'production',
    entry: {
        main: './ui/_tmp_dist/browser.js'
    },
    output: {
        path: path.resolve(__dirname, 'ui/src/js'),
        filename: '[name].bundle.js',
    },
    optimization: {
        runtimeChunk: 'single',
    },
    plugins: [
        new webpack.ids.HashedModuleIdsPlugin
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            name: (module, chunks, cacheGroupKey) => {
                const allChunksNames = chunks.map((chunk) => chunk.name).join('~');
                const prefix = cacheGroupKey === 'defaultVendors' ? 'vendors' : cacheGroupKey;
                return `${prefix}~${allChunksNames}`;
            },
        },
    }
}