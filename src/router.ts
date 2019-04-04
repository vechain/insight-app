import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Account from './views/Account.vue'
import Block from './views/Block.vue'
import Tx from './views/Tx.vue'
import Search from './views/Search.vue'

import AccountSummary from './views/AccountSummary.vue'
import AccountEvents from './views/AccountEvents.vue'
import AccountTransfers from './views/AccountTransfers.vue'
import AccountDeposit from './views/AccountDeposit.vue'

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
            component: Account,
            children: [{
                name: 'account',
                path: '',
                component: AccountSummary
            }, {
                path: 'transfers',
                component: AccountTransfers
            }, {
                path: 'events',
                component: AccountEvents
            }, {
                path: 'deposit',
                component: AccountDeposit
            }]
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
