<template>
    <b-container>
        <b-card no-body>
            <b-card-header class="border-bottom-0 pb-0">
                <span class="h4 mr-3">Account</span>

                <AccountLink no-link icon :address="address"/>
                <VeForgeLink btn type="acc" :arg="address" class="float-right"/>
            </b-card-header>
            <b-tabs card v-model="tab">
                <b-tab title="Summary" no-body/>
                <b-tab title="Transfers" no-body/>
                <b-tab title="Events" no-body/>
                <b-tab title="Deposit" no-body/>
            </b-tabs>
            <b-card-body>
                <transition name="fade" mode="out-in">
                    <keep-alive>
                        <router-view :key="$route.fullPath" ref="view"/>
                    </keep-alive>
                </transition>
            </b-card-body>
        </b-card>
    </b-container>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Account extends Vue {
    private tab = 0
    get address() { return this.$route.params.address.toLowerCase() }

    @Watch('tab')
    private tabChanged() {
        let tabName = ''
        switch (this.tab) {
            case 1: tabName = 'transfers'; break
            case 2: tabName = 'events'; break
            case 3: tabName = 'deposit'; break
        }
        this.$router.replace({
            path: `/accounts/${this.address}/${tabName}`
        })
    }

    private created() {
        this.$ga.page('/insight/account')

    }
    private mounted() {
        const viewName = (this.$refs.view as any).viewName

        switch (viewName) {
            case 'transfers': this.tab = 1; break
            case 'events': this.tab = 2; break
            case 'deposit': this.tab = 3; break
            default: this.tab = 0; break
        }
    }
}
</script>
