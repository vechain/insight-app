import Vue from 'vue'
import Vuex from 'vuex'
import { network } from './utils'

Vue.use(Vuex)

namespace Store {
    export type State = {
        chainStatus: Connex.Thor.Status
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
                chainStatus: connex.thor.status,
                price: null
            },
            mutations: {
                [Store.UPDATE_CHAIN_STATUS](state) {
                    state.chainStatus = connex.thor.status
                },
                [Store.UPDATE_PRICE](state, payload) {
                    state.price = payload
                }
            },
            actions: {}
        })

        if (network() === 'main') {
            (async () => {
                for (; ;) {
                    const p = await this.fetchPrice()
                    if (p) {
                        this.commit(Store.UPDATE_PRICE, p)
                    }
                    await new Promise(resolve => {
                        setTimeout(resolve, 5 * 60 * 1000)
                    })
                }
            })()
        }
    }

    private async fetchPrice() {
        // see https://www.coingecko.com/api/docs/v3#/simple/get_simple_price
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=vechain%2Cvethor-token&vs_currencies=usd`
        try {
            const resp = await fetch(url)
            if (resp.status === 200) {
                const json = await resp.json()
                const vet = json.vechain.usd as number
                const vtho = json['vethor-token'].usd as number
                return { vet, vtho }
            }
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.warn(err)
        }
        return null
    }
}

export default Store
