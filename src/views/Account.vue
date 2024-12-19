<template>
    <b-container>
        <b-card no-body>
            <b-card-header class="border-bottom-0 pb-0">
                <span class="h4 mr-3">Account</span>
                <div class="d-flex">
                    <div class="d-inline-flex align-items-center mw-100 mt-1">
                        <Ident
                            class="mr-2 flex-shrink-0"
                            :value="address"
                            style="width: 3.64em; height: 2.6em; border-radius: 0.2em"
                        />
                        <div class="d-flex flex-column">
                            <div>
                                <span class="text-monospace text-truncate">{{ address|checksum }}</span>
                                <Copy
                                    :value="address|checksum"
                                    class="ml-2"
                                />
                            </div>
                            <span v-if="resolvedName" class="text-monospace text-truncate text-black-50" style="font-size: 75%;">{{ resolvedName }}</span>
                        </div> 
                    </div>
                    
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
import { resolveDomainName } from '@/resolver';
import { genesisIdToNetwork } from '@/utils';

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
    },
    asyncComputed: {
        async resolvedName(): Promise<string | null> {
            if (genesisIdToNetwork(this.$connex.thor.genesis.id) !== 'main') {
                return null
            }
            return resolveDomainName(this.address, this.$connex)
        }
    },
})
</script>
