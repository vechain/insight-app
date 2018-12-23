import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Store from './store'
import './registerServiceWorker'
import './filters'
import Loading from '@/components/Loading.vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'roboto-fontface/css/roboto-slab/roboto-slab-fontface.css'
import 'typeface-roboto-mono'

Vue.config.productionTip = false

Vue.component('Loading', Loading)


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
