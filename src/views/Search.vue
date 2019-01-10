<template>
    <Loading :error="error" @reload="reload"/>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Search extends Vue {
    error: Error | null = null

    async reload() {
        const str = ((this.$route.query.q as string) || '').trim()
        if (!str) {
            return this.$router.replace({ name: 'home' })
        }

        if (/^0x[0-9a-f]{40}$/i.test(str)) {
            //address
            return this.$router.replace({ name: 'account', params: { address: str } })
        } else if (/^0x[0-9-a-f]{64}$/i.test(str)) {
            //bytes32
            try {
                const [block, tx] = await Promise.all([
                    connex.thor.block(str).get(),
                    connex.thor.transaction(str).get()
                ])

                if (block) {
                    return this.$router.replace({ name: 'block', params: { id: block.id } })
                }
                if (tx) {
                    return this.$router.replace({ name: 'tx', params: { id: tx.id } })
                }
            } catch (err) {
                this.error = err
            }
        } else if (/^[0-9]+$/.test(str)) {
            const num = parseInt(str)
            if (num < 2 ** 32) {
                try {
                    const block = await connex.thor.block(num).get()
                    if (block) {
                        return this.$router.replace({ name: 'block', params: { id: block.id } })
                    }
                } catch (err) {
                    this.error
                }
            }
        }
        if (!this.error) {
            this.error = new Error(`No result for '${str}'`)
        }
    }

    created() {
        this.reload()
    }
}
</script>

