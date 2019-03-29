const Path = require('path')

module.exports = {
    lintOnSave: false,
    baseUrl: '/',
    pwa: {
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true
        }
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
        if (process.env.NODE_ENV === 'production') {
            config.optimization.get('minimizer')[0].options.terserOptions.keep_fnames = true 
        }
    }
}
