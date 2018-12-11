<template>
    <div>
        <div v-if="recentBlocks.length>0" class="columns">
            <div class="col-5">
                <div>
                    <b>Recent blocks</b>
                </div>
                <div >
                    <div v-for="b in recentBlocks" :key="b.id" class="card my-1">
                        <div class="card-header">
                            <div class="tile">
                                <div>#{{b.number}}</div>
                                <div class="tile-content text-right">{{b.id | abbr}}</div>
                            </div>
                            <div class="text-right text-gray">{{b.timestamp | ago}}</div>
                        </div>
                        <div class="card-body">
                            <div class="tile">
                                <div class="text-gray">Transactions</div>
                                <div class="tile-content text-right">{{b.transactions.length}}</div>
                            </div>
                            <div class="tile">
                                <div class="text-gray">Gas Used</div>
                                <div class="tile-content text-right">{{b.gasUsed | locale}}</div>
                            </div>
                            <div class="tile">
                                <div class="text-gray">Signer</div>
                                <div class="tile-content text-right">{{b.signer | abbr}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-8"></div>
        </div>
        <Loading v-else/>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"


@Component
export default class Home extends Vue {
    recentBlocks: Connex.Thor.Block[] = []

    get status(): Connex.Thor.Status {
        return this.$store.state.chainStatus
    }

    @Watch('status')
    async queryBlocks() {
        const blocks: Connex.Thor.Block[] = []
        let bv = connex.thor.block(this.status.head.id)
        for (let i = 0; i < 5; i++) {
            const block = await bv.get()
            if (!block) {
                break
            }
            blocks.push(block)
            bv = connex.thor.block(block.parentID)
        }
        this.recentBlocks = blocks
    }

    created() {
        this.queryBlocks()
    }
}
</script>
