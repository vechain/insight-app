import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'spectre.css/dist/spectre.min.css'
import 'spectre.css/dist/spectre-icons.min.css'
import './filters'
import Loading from '@/components/Loading.vue'


Vue.config.productionTip = false

Vue.component('Loading', Loading)

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');

(async () => {
    const ticker = connex.thor.ticker()
    for (; ;) {
        await ticker.next()
        store.commit('UPDATE_CHAIN_STATUS')
    }
})()
