import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import Router from './router'
import Store from './store'
import './registerServiceWorker'
import './filters'
import VueClipboard from 'vue-clipboard2'

import './style.scss'
import VueAnalytics from 'vue-analytics'

import '@/components'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueAnalytics, {
    id: 'UA-132391998-2',
    disabled: process.env.NODE_ENV !== 'production'
})

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

new App({
    router: Router,
    store : new Store(),
}).$mount('#app')

