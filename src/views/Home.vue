<template>
    <div>
        <div class="h6 text-center">Recent Blocks</div>
        <div v-if="recentBlocks.length>0">
            <transition-group tag="div" name="block-list">
                <div class="card my-2" v-for="b in recentBlocks" :key="b.id">
                    <div class="card-body columns" style="align-items: center;">
                        <div class="column col-3">
                            <div class="h5">
                                <router-link :to="{name:'block', params: {id: b.id}}">{{b.number}}</router-link>
                            </div>
                            <div class="caption text-mono">{{b.id | abbr}}</div>
                            <div class="caption text-gray">{{b.timestamp | ago}}</div>
                        </div>
                        <div class="column columns text-center">
                            <div class="column">
                                <div class="heading">Gas Used</div>
                                <div class="h6">{{b.gasUsed | locale}}</div>
                            </div>
                            <div class="column">
                                <div class="heading">Transactions</div>
                                <div class="h6">{{b.transactions.length}}</div>
                            </div>
                            <div class="column">
                                <div class="heading">Signer</div>
                                <AccountLink :address="b.signer" abbr/>
                            </div>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
        <Loading v-else class="mx-2 my-2" @reload="reload"/>
    </div>
</template>        
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"


@Component
export default class Home extends Vue {
    recentBlocks: Connex.Thor.Block[] = []

    get head(): Connex.Thor.Status['head'] {
        return this.$store.state.chainStatus.head
    }

    @Watch('head')
    async reload() {
        try {
            const headNum = this.head.number
            const requests: Promise<Connex.Thor.Block | null>[] = []
            for (let i = headNum; i >= Math.max(headNum - 4, 0); i--) {
                requests.push(connex.thor.block(i).get())
            }

            const blocks = await Promise.all(requests)
            if (blocks.every(b => !!b)) {
                this.recentBlocks = blocks as any
            }
        } catch (err) {
            console.warn(err)
        }
    }

    created() {
        this.$ga.page('/insight/home')
        this.reload()
    }
}
</script>
<style lang="scss" scoped>
.block-list-enter-active {
    transition: all 0.4s;
    transition-timing-function: ease;
}
.block-list-enter {
    transform: translateY(-30%);
    opacity: 0;
}
.block-list-leave-to {
    opacity: 0;
}

.block-list-move {
    transition: all 0.3s;
    transition-timing-function: ease;
}
</style>
