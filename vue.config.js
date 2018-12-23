module.exports = {
    lintOnSave: false,
    baseUrl: process.env.NODE_ENV === 'production' ? '/insight-app/' : '/',
    pwa: {
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true
        }
    }
}
