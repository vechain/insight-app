import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Store from './store'
import './registerServiceWorker'
import './filters'

import './style.scss'
import 'spectre.css/dist/spectre-icons.css'
import VueAnalytics from 'vue-analytics'

import '@/components'


Vue.config.productionTip = false
Vue.use(VueAnalytics, {
    id: 'UA-132391998-2'
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
