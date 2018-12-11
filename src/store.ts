import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        chainStatus: connex.thor.status
    },
    mutations: {
        UPDATE_CHAIN_STATUS(state) {
            state.chainStatus = connex.thor.status
        }
    },
    actions: {}
})

