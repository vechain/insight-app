import { register } from 'register-service-worker'
import { fetchGenesis } from './create-connex'

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
            state.updateAvailable = true
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
import './filters'
import VueClipboard from 'vue-clipboard2'

import './style.scss'
import VueAnalytics from 'vue-analytics'

import '@/components'
import { build } from './state'
import AsyncComputed from 'vue-async-computed'


Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueAnalytics, {
    id: 'UA-132391998-2',
    disabled: process.env.NODE_ENV !== 'production'
})

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(AsyncComputed)

const state = build()
Object.defineProperty(Vue.prototype, '$state', {
    get() { return state }
})

fetchGenesis().then(() => {
    new App({ router: Router }).$mount('#app')
})

declare module 'vue/types/vue' {
    interface Vue {
        $state: ReturnType<typeof build>
    }
}
