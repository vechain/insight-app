import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Account from './views/Account.vue'
import Block from './views/Block.vue'
import Tx from './views/Tx.vue'
import Search from './views/Search.vue'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/blocks/:id',
            name: 'block',
            component: Block
        },
        {
            path: '/txs/:id',
            name: 'tx',
            component: Tx
        },
        {
            path: '/accounts/:address',
            name: 'account',
            component: Account
        },
        {
            path: '/search',
            name: 'search',
            component: Search
        },
        {
            path: '*',
            redirect: '/'
        }
    ],
})
