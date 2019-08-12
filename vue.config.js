const Path = require('path')

module.exports = {
    lintOnSave: false,
    baseUrl: '/',
    pwa: {
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true
        },
        name: 'Insight',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black-translucent'
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
    }
}
