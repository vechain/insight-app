<template>
    <b-container>
        <b-card no-body>
            <b-card-header class="border-bottom-0 pb-0">
                <span class="h4 mr-3">Account</span>

                <AccountLink no-link icon :address="address"/>
                <VeForgeLink btn type="acc" :arg="address" class="float-right"/>
            </b-card-header>
            <b-tabs card v-model="tab">
                <b-tab title="Summary" no-body @click="clickTab('./')"/>
                <b-tab title="Transfers" no-body @click="clickTab('transfers')"/>
                <b-tab title="Events" no-body @click="clickTab('events')"/>
                <b-tab title="Deposit" no-body @click="clickTab('deposit')"/>
            </b-tabs>
            <b-card-body>
                <transition name="fade" mode="out-in">
                    <keep-alive>
                        <router-view :key="$route.fullPath"/>
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

    private clickTab(tab: string) {
        this.$router.replace({
            path: tab
        })
    }

    private created() {
        this.$ga.page('/insight/account')

        const path = this.$route.path
        if (path.endsWith('/transfers')) {
            this.tab = 1
        } else if (path.endsWith('/events')) {
            this.tab = 2
        } else if (path.endsWith('/deposit')) {
            this.tab = 3
        }
    }
}
</script>
