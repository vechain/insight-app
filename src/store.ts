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
    }
}

class Store extends Vuex.Store<Store.State> {
    public static readonly UPDATE_CHAIN_STATUS = 'updateChainStatus'
    public static readonly UPDATE_PRICE = 'updatePrice'
    constructor() {
        super({
            state: {
                chainStatus: null,
                price: null
            },
            mutations: {
                [Store.UPDATE_CHAIN_STATUS](state, payload) {
                    state.chainStatus = payload
                },
                [Store.UPDATE_PRICE](state, payload) {
                    state.price = payload
                }
            },
            actions: {}
        })
    }
}

export default Store
