import Vue from 'vue'
import Router from 'vue-router'
import Frame from './views/Frame.vue'
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
            path: '/:net?',
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: Home,
                },
                {
                    path: 'blocks/:id',
                    name: 'block',
                    component: Block
                },
                {
                    path: 'txs/:id',
                    name: 'tx',
                    component: Tx
                },
                {
                    path: 'accounts/:address',
                    component: Account,
                    name: 'account',
                    redirect: { name: 'summary' },
                    children: [{
                        name: 'summary',
                        path: '',
                        component: AccountSummary
                    }, {
                        name: 'transfers',
                        path: 'transfers',
                        component: AccountTransfers
                    }, {
                        name: 'events',
                        path: 'events',
                        component: AccountEvents
                    }, {
                        name: 'deposit',
                        path: 'deposit',
                        component: AccountDeposit,
                    }]
                },
                {
                    path: '/search',
                    name: 'search',
                    component: Search
                }
            ],
            component: Frame
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
