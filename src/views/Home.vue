<template>
    <div class="overflow-hidden mt-n4">
        <b-jumbotron
            class="text-center mt-n4"
            text-variant="light"
            bg-variant="secondary"
            style="border-radius:0px;"
        >
            <div slot="header" style="font-size:60%;" class="font-weight-lighter">
                VeChain
                <span class="text-serif">Insight</span>
            </div>
            <div slot="lead">Serverless Explorer</div>
            <b-input-group class="mx-auto col-lg-6">
                <b-form-input
                    placeholder="block, tx or account"
                    class="border-0"
                    v-model="searchString"
                    @keydown.enter.prevent="search"
                />
                <b-input-group-append>
                    <b-button variant="primary" @click="search">
                        <SvgIcon name="search" />
                    </b-button>
                </b-input-group-append>
            </b-input-group>
        </b-jumbotron>
        <b-container>
            <b-row>
                <b-col lg="7">
                    <h5 class="ml-3">
                        Bandwidth
                        <b-spinner v-if="!bandwidthChartLoaded" type="grow" small class="ml-3" />
                    </h5>
                    <div class="px-1 py-2 mb-3" v-show="bandwidthChartLoaded">
                        <BandwidthChart :height="100" @loaded="bandwidthChartLoaded=true" />
                    </div>
                    <h5 class="ml-3">
                        Recent Blocks
                        <b-spinner v-if="!recentBlocks" type="grow" small class="ml-3" />
                    </h5>
                    <transition-group
                        tag="div"
                        name="stack"
                        class="position-relative"
                        v-if="recentBlocks"
                    >
                        <b-card v-for="b in recentBlocks" :key="b.id" class="stack-item mb-3">
                            <b-row no-gutters>
                                <b-col cols="4">
                                    <div>
                                        <router-link :to="{name:'block', params: {id: b.id}}">
                                            <SvgIcon name="package" class="mr-1" />
                                            {{b.number}}
                                        </router-link>
                                    </div>
                                    <div
                                        class="text-muted small text-truncate"
                                    >{{b.timestamp | ago}}</div>
                                </b-col>
                                <b-col cols="4">
                                    <div>{{b.transactions.length}} Txs</div>
                                    <div class="small text-truncate">{{b.gasUsed | locale}} Gas</div>
                                </b-col>
                                <b-col cols="4" title="Signer" class="text-right">
                                    <SvgIcon class="text-secondary mr-2" name="shield" />
                                    <AccountLink :address="b.signer" abbr class="text-truncate" />
                                </b-col>
                            </b-row>
                        </b-card>
                    </transition-group>
                </b-col>
                <b-col lg="5">
                    <h5 class="ml-3">
                        Recent Transfers
                        <b-spinner v-if="!recentTransfers" type="grow" small class="ml-3" />
                    </h5>
                    <b-list-group v-if="recentTransfers" style="font-size:90%">
                        <transition-group tag="div" class="position-relative" name="stack">
                            <b-list-group-item
                                style="font-size:95%"
                                v-for="(t) in recentTransfers"
                                :key="t.id"
                                :to="{name: 'tx', params:{id: t.meta.txID}}"
                                class="stack-item"
                            >
                                <b-row class="align-items-center" no-gutters>
                                    <b-col cols="5">
                                        <AccountLink icon :address="t.sender" abbr />
                                    </b-col>
                                    <b-col cols="2">
                                        <SvgIcon name="arrow-right" />
                                    </b-col>
                                    <b-col cols="5">
                                        <AccountLink icon :address="t.recipient" abbr />
                                    </b-col>
                                </b-row>
                                <div>
                                    <span class="text-muted small">{{t.meta.blockTimestamp | ago}}</span>
                                    <Amount sym="VET" class="float-right">{{t.amount}}</Amount>
                                </div>
                            </b-list-group-item>
                        </transition-group>
                    </b-list-group>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>        


<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component({ name: 'Home' })
export default class Home extends Vue {
    private recentBlocks: Connex.Thor.Block[] | null = null
    private recentTransfers: Connex.Thor.Transfer[] | null = null
    private loadingBlocks = false
    private loadingTransfers = false
    private searchString = ''
    private bandwidthChartLoaded = false

    get head(): Connex.Thor.Status['head'] {
        return this.$store.state.chainStatus.head
    }

    @Watch('head')
    private reload() {
        this.loadRecentBlocks()
        this.loadRecentTransfers()
    }

    private async loadRecentBlocks() {
        if (this.loadingBlocks) {
            return
        }
        try {
            this.loadingBlocks = true
            const headNum = this.head.number
            const requests: Array<Promise<Connex.Thor.Block | null>> = []
            for (let i = headNum; i >= Math.max(headNum - 4, 0); i--) {
                requests.push(this.$connex.thor.block(i).get())
            }

            const blocks = await Promise.all(requests)
            if (blocks.every(b => !!b)) {
                this.recentBlocks = blocks as any
            }
        } catch (err) {
            console.warn(err)
        } finally {
            this.loadingBlocks = false
        }
    }

    private async loadRecentTransfers() {
        if (this.loadingTransfers) {
            return
        }
        try {
            this.loadingTransfers = true
            const result = await this.$connex.thor
                .filter('transfer')
                .order('desc')
                .apply(0, 10)
            let counter = 0
            let lastBlockID = ''
            this.recentTransfers = result.map(t => {
                if (lastBlockID !== t.meta!.blockID) {
                    counter = 0
                    lastBlockID = t.meta!.blockID
                }
                const id = t.meta!.blockID + counter
                counter++
                lastBlockID = t.meta!.blockID
                return {
                    id,
                    ...t
                }
            })
        } catch (err) {
            console.warn(err)
        } finally {
            this.loadingTransfers = false
        }
    }

    private created() {
        this.$ga.page('/insight/home')
        this.reload()
    }

    private search() {
        const str = this.searchString.trim()
        this.searchString = ''
        if (!str) {
            return
        }
        this.$router.push({ name: 'search', query: { q: str } })
    }
}
</script>
<style lang="scss" scoped>
.stack-item {
    transition: all 0.6s;
    transition-timing-function: ease;
}

.stack-enter {
    transform: scale(0.5, 0);
    transform-origin: 50% 0%;
    opacity: 0;
}
.stack-leave-active {
    position: absolute;
    left: 0px;
    right: 0px;
}
.stack-leave-to {
    opacity: 0;
}
</style>
