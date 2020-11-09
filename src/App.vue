<template>
    <div class="app">
        <b-alert
            v-model="$state.updateAvailable"
            variant="primary"
            class="py-1 rounded-0 m-0"
        >
            New content available,
            <a
                href="#"
                @click="forceReload"
            >reload</a> to upgrade
        </b-alert>
        <router-view key="frame" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { genesisIdToNetwork } from "./utils"
import { createConnex } from "./create-connex"

export default Vue.extend({
    methods: {
        routed() {
            if (!this.$route.params.net) {
                this.$router.replace({
                    ...this.$route,
                    params: { ...this.$route.params, net: this.$net },
                })
                return
            }
            if (this.$route.params.net !== this.$net) {
                window.location.reload()
            }
        },
        async fetchPrice() {
            // see https://www.coingecko.com/api/docs/v3#/simple/get_simple_price
            const url = `https://api.coingecko.com/api/v3/simple/price?ids=vechain%2Cvethor-token&vs_currencies=usd`
            try {
                const resp = await fetch(url)
                if (resp.status === 200) {
                    const json = await resp.json()
                    const vet = json.vechain.usd as number
                    const vtho = json["vethor-token"].usd as number
                    return { vet, vtho }
                }
            } catch (err) {
                // tslint:disable-next-line:no-console
                console.warn(err)
            }
            return null
        },
        forceReload() {
            window.location.reload(true)
        }
    },
    watch: {
        '$route.path'() {
            this.routed()
        }
    },
    created() {
        let net = this.$route.params.net as "main" | "test" | undefined
        if (!["main", "test"].includes(net!)) {
            net = undefined
        }

        const connex = createConnex(net)
        Vue.prototype.$connex = connex
        Vue.prototype.$net = genesisIdToNetwork(connex.thor.genesis.id)
        if (!["main", "test"].includes(Vue.prototype.$net)) {
            Vue.prototype.$net = undefined
        }

        this.routed()

        this.$state.chainStatus = this.$connex.thor.status
        void (async () => {
            const ticker = this.$connex.thor.ticker()
            for (; ;) {
                await ticker.next()
                this.$state.chainStatus = this.$connex.thor.status
            }
        })()

        if (this.$net === "main") {
            (async () => {
                for (; ;) {
                    const p = await this.fetchPrice()
                    if (p) {
                        this.$state.price = p
                    }
                    await new Promise((resolve) => {
                        setTimeout(resolve, 5 * 60 * 1000)
                    })
                }
            })()
        }
    }
})
</script>
