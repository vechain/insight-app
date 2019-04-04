<template>
    <div>
        <p>
            <b-button class="px-3 mr-2" @click="reload" size="sm" :disabled="loading">⟳</b-button>
            <b-button-group size="sm" :disabled="loading">
                <b-button class="px-3" :disabled="!canPrev" @click="prevPage">&lsaquo;</b-button>
                <b-button class="px-3" :disabled="!canNext" @click="nextPage">&rsaquo;</b-button>
            </b-button-group>
            <span v-if="range" class="ml-3">{{range[0]}} - {{range[1]}}</span>
        </p>

        <Loading v-if="loading" class="my-3"/>
        <div v-else-if="error" class="text-center">
            <p>Oops</p>
            <p class="text-warning">Error: {{error.message}}</p>
        </div>
        <template v-else-if="items.length">
            <Event
                v-for="(item,i) in items"
                :key="i"
                :item="item"
                :index="i + offset"
                :class="{'mt-3':i>0}"
                class="small"
            />
        </template>
        <div v-else class="text-center">No content</div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

const pageSize = 5

@Component
export default class AccountEvents extends Vue {

    get address() { return this.$route.params.address.toLowerCase() }
    private items = null as Connex.Thor.Event[] | null
    private error = null as Error | null
    private loading = false
    private offset = 0

    get canNext() { return this.items && this.items.length === pageSize }
    get canPrev() { return this.items && this.offset > 0 }
    get range() {
        if (!this.loading && this.items && this.items.length > 0) {
            return [this.offset, this.offset + this.items.length]
        }
        return null
    }

    private nextPage() {
        this.offset += pageSize
        this.reload()
    }

    private prevPage() {
        if (this.offset >= pageSize) {
            this.offset -= pageSize
            this.reload()
        }
    }

    private async reload() {
        if (this.loading) {
            return
        }
        try {
            this.loading = true
            this.error = null
            this.items = await connex.thor.filter('event')
                .criteria([{ address: this.address }])
                .order('desc')
                .apply(this.offset, pageSize)
        } catch (err) {
            this.error = err
        } finally {
            this.loading = false
        }
    }

    private created() {
        this.reload()
    }

}


</script>

