<template>
    <div class="app">
        <b-alert
            v-model="$store.state.newContentAvailable"
            variant="primary"
            class="py-1 rounded-0 m-0"
        >
            New content available,
            <a href="#" @click="reload">reload</a> to upgrade
        </b-alert>
        <router-view key="frame" />
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { genesisIdToNetwork } from "./utils";
import { createConnex } from "./create-connex";
import Store from "./store";

@Component
export default class App extends Vue {
    public created() {
        let net = this.$route.params.net as "main" | "test" | undefined;
        if (!["main", "test"].includes(net!)) {
            net = undefined;
        }

        const connex = createConnex(net);
        Vue.prototype.$connex = connex;
        Vue.prototype.$net = genesisIdToNetwork(connex.thor.genesis.id);
        if (!["main", "test"].includes(Vue.prototype.$net)) {
            Vue.prototype.$net = undefined;
        }

        this.routed();

        this.$store.commit(Store.UPDATE_CHAIN_STATUS, this.$connex.thor.status);
        (async () => {
            const ticker = this.$connex.thor.ticker();
            for (;;) {
                await ticker.next();
                this.$store.commit(
                    Store.UPDATE_CHAIN_STATUS,
                    this.$connex.thor.status
                );
            }
        })();

        if (this.$net === "main") {
            (async () => {
                for (;;) {
                    const p = await this.fetchPrice();
                    if (p) {
                        this.$store.commit(Store.UPDATE_PRICE, p);
                    }
                    await new Promise((resolve) => {
                        setTimeout(resolve, 5 * 60 * 1000);
                    });
                }
            })();
        }
    }

    @Watch("$route.path")
    private routed() {
        if (this.$route.params.net && this.$route.params.net !== this.$net) {
            window.location.reload();
            return;
        }
        this.$router.replace({
            ...this.$route,
            params: { ...this.$route.params, net: this.$net },
        });
    }

    private async fetchPrice() {
        // see https://www.coingecko.com/api/docs/v3#/simple/get_simple_price
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=vechain%2Cvethor-token&vs_currencies=usd`;
        try {
            const resp = await fetch(url);
            if (resp.status === 200) {
                const json = await resp.json();
                const vet = json.vechain.usd as number;
                const vtho = json["vethor-token"].usd as number;
                return { vet, vtho };
            }
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.warn(err);
        }
        return null;
    }

    private reload() {
        window.location.reload();
    }
}
</script>

