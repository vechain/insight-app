<template>
    <div>
        <p>
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
        </p>

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
        <template v-else-if="items && items.length">
            <Event
                v-for="(item,i) in items"
                :key="i"
                :item="item"
                :index="i + offset"
                :class="{'mt-3':i>0}"
                class="small"
            />
        </template>
        <div
            v-else
            class="text-center"
        >No content</div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

const pageSize = 5

export default Vue.extend({
    data: () => {
        return {
            address: '',
            items: null as Connex.VM.Event[] | null,
            error: null as Error | null,
            loading: false,
            offset: 0
        }
    },
    computed: {
        canNext() { return this.items && this.items.length === pageSize },
        canPrev() { return this.items && this.offset > 0 },
        range() {
            if (!this.loading && this.items && this.items.length > 0) {
                return [this.offset, this.offset + this.items.length]
            }
            return null
        }
    },
    methods: {
        nextPage() {
            this.offset += pageSize
            this.reload()
        },
        prevPage() {
            if (this.offset >= pageSize) {
                this.offset -= pageSize
                this.reload()
            }
        },
        async reload() {
            if (this.loading) {
                return
            }
            try {
                this.loading = true
                this.error = null
                this.items = await this.$connex.thor.filter('event', [{ address: this.address }])
                    .order('desc')
                    .apply(this.offset, pageSize)
            } catch (err) {
                this.error = err
            } finally {
                this.loading = false
            }
        }
    },
    created() {
        this.address = this.$route.params.address.toLowerCase()
        this.reload()
    }
})
</script>

