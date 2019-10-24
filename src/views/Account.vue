<template>
    <b-container>
        <b-card no-body>
            <b-card-header class="border-bottom-0 pb-0">
                <span class="h4 mr-3">Account</span>

                <AccountLink no-link icon :address="address" />
            </b-card-header>
            <b-tabs card v-model="tab" class="text-capitalize">
                <b-tab v-for="n in tabNames" :title="n" :key="n" no-body />
            </b-tabs>
            <b-card-body>
                <transition name="fade" mode="out-in">
                    <keep-alive>
                        <router-view :key="$route.fullPath" ref="view" />
                    </keep-alive>
                </transition>
            </b-card-body>
        </b-card>
    </b-container>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

const tabNames = ['summary', 'transfers', 'events', 'deposit']

@Component({ name: 'Account' })
export default class Account extends Vue {
    private tab = 0
    private address = ''
    private tabNames = ['summary', 'transfers', 'events', 'deposit']

    @Watch('tab')
    private tabChanged(newTab: number) {
        this.$router.replace({ name: this.tabNames[newTab] })
    }

    private created() {
        this.$ga.page('/insight/account')
        this.address = this.$route.params.address.toLowerCase()
    }
    private mounted() {
        this.tab = this.tabNames.indexOf(this.$route.name!) || 0
    }
}
</script>
