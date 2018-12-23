import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

namespace Store {
    export type State = {
        chainStatus: Connex.Thor.Status
    }
}

class Store extends Vuex.Store<Store.State> {
    public static readonly UPDATE_CHAIN_STATUS = 'updateChainStatus'
    constructor() {
        super({
            state: {
                chainStatus: connex.thor.status
            },
            mutations: {
                [Store.UPDATE_CHAIN_STATUS](state) {
                    state.chainStatus = connex.thor.status
                }
            },
            actions: {}
        })
    }
}

export default Store
