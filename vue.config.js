module.exports = {
    lintOnSave: false,
    baseUrl: '/',
    pwa: {
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true
        }
    }
}
