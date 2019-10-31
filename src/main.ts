import { register } from 'register-service-worker'

/* tslint:disable:no-console */
if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log(
                'App is being served from cache by a service worker.\n' +
                'For more details, visit https://goo.gl/AFskqB',
            )
        },
        registered() {
            console.log('Service worker has been registered.')
        },
        cached() {
            console.log('Content has been cached for offline use.')
        },
        updatefound() {
            console.log('New content is downloading.')
        },
        updated() {
            store.commit(Store.UPDATE_NEW_CONTENT_AVAILABLE, true)
            console.log('New content is available; please refresh.')
        },
        offline() {
            console.log('No internet connection found. App is running in offline mode.')
        },
        error(error) {
            console.error('Error during service worker registration:', error)
        },
    })
}

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import Router from './router'
import Store from './store'
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

const store = new Store()
new App({
    router: Router,
    store,
}).$mount('#app')

