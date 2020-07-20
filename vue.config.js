const Path = require('path')
const webpack = require('webpack')

module.exports = {
    lintOnSave: false,
    publicPath: './',
    pwa: {
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true
        },
        name: 'Insight',
        appleMobileWebAppCapable: 'yes',
        themeColor: '#6c757d'
    },
    chainWebpack: config => {
        config.module.rules.delete("svg")
        config.module
            .rule('svg-sprite-loader')
            .test(/\.svg$/)
            .include
            .add(Path.resolve('src/assets/'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
        config.plugin('ignore').use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    }
}
