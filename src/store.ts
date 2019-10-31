import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

namespace Store {
    export type State = {
        chainStatus: Connex.Thor.Status | null
        price: {
            vet: number,
            vtho: number
        } | null
        newContentAvailable: boolean
    }
}

class Store extends Vuex.Store<Store.State> {
    public static readonly UPDATE_CHAIN_STATUS = 'updateChainStatus'
    public static readonly UPDATE_PRICE = 'updatePrice'
    public static readonly UPDATE_NEW_CONTENT_AVAILABLE = 'updateNewContentAvailable'
    constructor() {
        super({
            state: {
                chainStatus: null,
                price: null,
                newContentAvailable: false
            },
            mutations: {
                [Store.UPDATE_CHAIN_STATUS](state, payload) {
                    state.chainStatus = payload
                },
                [Store.UPDATE_PRICE](state, payload) {
                    state.price = payload
                },
                [Store.UPDATE_NEW_CONTENT_AVAILABLE](state, payload) {
                    state.newContentAvailable = payload
                }
            },
            actions: {}
        })
    }
}

export default Store
