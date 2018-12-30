import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Store from './store'
import './registerServiceWorker'
import './filters'

import './style.scss'
import 'typeface-roboto'
import 'typeface-roboto-mono'
import 'typeface-roboto-slab'
import 'spectre.css/dist/spectre-icons.css'

import '@/components'


Vue.config.productionTip = false

let store: Store | undefined

if (window.connex) {
    store = new Store();
    (async () => {
        const ticker = connex.thor.ticker()
        for (; ;) {
            await ticker.next()
            store.commit(Store.UPDATE_CHAIN_STATUS)
        }
    })()
}

new App({
    router,
    store,
}).$mount('#app')
