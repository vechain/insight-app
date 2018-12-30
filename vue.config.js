module.exports = {
    lintOnSave: false,
    baseUrl: process.env.NODE_ENV === 'production' ? '/insight/' : '/',
    pwa: {
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true
        }
    }
}
