<template>
    <div>
        <div class="py-3 px-1">
            <b-button
                class="px-3 mr-2"
                @click="reload"
                size="sm"
                :disabled="loading"
            >⟳</b-button>
            <b-button-group
                size="sm"
                :disabled="loading"
            >
                <b-button
                    class="px-3"
                    :disabled="!canPrev"
                    @click="prevPage"
                >&lsaquo;</b-button>
                <b-button
                    class="px-3"
                    :disabled="!canNext"
                    @click="nextPage"
                >&rsaquo;</b-button>
            </b-button-group>
            <span
                v-if="range"
                class="ml-3"
            >{{range[0]}} - {{range[1]}}</span>
        </div>
        <Loading
            v-if="loading"
            class="my-3"
        />
        <div
            v-else-if="error"
            class="text-center"
        >
            <p>Oops</p>
            <p class="text-warning">Error: {{error.message}}</p>
        </div>
        <b-list-group
            flush
            v-else-if="items && items.length"
        >
            <b-list-group-item
                v-for="(item,i) in items"
                :key="i"
                :to="item.txid? {name: 'tx', params:{id: item.txid}}: undefined"
            >
                <TransferItem
                    :data="item"
                    :sym="sym"
                />
            </b-list-group-item>
        </b-list-group>
        <div
            v-else
            class="text-center"
        >No content</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

type LoaderFunc = (offset: number, pageSize: number) => Promise<TransferItemData[]>

export default Vue.extend({
    props: {
        loader: Function as unknown as () => LoaderFunc,
        pageSize: { default: 10 },
        sym: String
    },
    data: () => {
        return {
            items: null as TransferItemData[] | null,
            error: null as Error | null,
            loading: false,
            offset: 0
        }
    },
    computed: {
        canNext(): boolean { return !!this.items && this.items.length === this.pageSize },
        canPrev(): boolean { return !!this.items && this.offset > 0 },
        range(): [number, number] | null {
            if (!this.loading && this.items && this.items.length > 0) {
                return [this.offset, this.offset + this.items.length]
            }
            return null
        }
    },
    methods: {
        nextPage() {
            this.offset += this.pageSize
            this.reload()
        },
        prevPage() {
            if (this.offset >= this.pageSize) {
                this.offset -= this.pageSize
                this.reload()
            }
        },
        async reload() {
            if (this.loading) {
                return
            }
            this.error = null
            this.loading = true
            this.items = null
            try {
                this.items = await this.loader(this.offset, this.pageSize)
            } catch (err) {
                this.error = err
            } finally {
                this.loading = false
            }
        }
    },
    created() {
        this.reload()
    }
})
</script>
