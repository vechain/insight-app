import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import Store from './store'
import './registerServiceWorker'
import './filters'


import './style.scss'
import VueAnalytics from 'vue-analytics'

import '@/components'

import { createConnex } from './external-connex'

if (window.connex) {
    start()
} else {
    createConnex().then(c => {
        Object.defineProperty(window, 'connex', {
            value: c,
            enumerable: true
        })
        start()
    })
}


function start() {
    Vue.config.productionTip = false
    Vue.use(BootstrapVue)
    Vue.use(VueAnalytics, {
        id: 'UA-132391998-2',
        disabled: process.env.NODE_ENV !== 'production'
    })

    let store: Store | undefined

    store = new Store()

    new App({
        router,
        store,
    }).$mount('#app');

    (async () => {
        const ticker = connex.thor.ticker()
        for (; ;) {
            await ticker.next()
            store.commit(Store.UPDATE_CHAIN_STATUS)
        }
    })()
}
