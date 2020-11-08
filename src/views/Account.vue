<template>
    <b-container>
        <b-card no-body>
            <b-card-header class="border-bottom-0 pb-0">
                <span class="h4 mr-3">Account</span>
                <div class="d-flex">
                    <AccountLink
                        no-link
                        icon
                        :address="address"
                        style="min-width:0px"
                    />
                    <Copy
                        :value="address|checksum"
                        class="ml-2"
                    />
                </div>
            </b-card-header>
            <b-tabs
                card
                v-model="tab"
                class="text-capitalize"
            >
                <b-tab
                    v-for="n in tabNames"
                    :title="n"
                    :key="n"
                    no-body
                />
            </b-tabs>
            <b-card-body>
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <keep-alive>
                        <router-view
                            :key="$route.fullPath"
                            ref="view"
                        />
                    </keep-alive>
                </transition>
            </b-card-body>
        </b-card>
    </b-container>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    data: () => {
        return {
            tab: 0,
            address: ''
        }
    },
    computed: {
        tabNames() { return ['summary', 'transfers', 'events'] }
    },
    watch: {
        tab(newTab: number) {
            this.$router.replace({ name: this.tabNames[newTab] })
        }
    },
    created() {
        this.$ga.page('/insight/account')
        this.address = this.$route.params.address.toLowerCase()
        this.tab = this.tabNames.indexOf(this.$route.name!)
        if (this.tab < 0) {
            this.tab = 0
        }
    }
})
</script>
