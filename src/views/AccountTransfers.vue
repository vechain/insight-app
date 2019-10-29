<template>
    <div>
        <b-tabs pills small no-key-nav no-body v-model="tab" align="center">
            <b-tab v-for="item in tabs" :key="item.title" :title="item.title" />
        </b-tabs>
        <transition name="fade" mode="out-in">
            <keep-alive>
                <TransferItemList :loader="tabs[tab].loader" :sym="tabs[tab].sym" :key="tab" />
            </keep-alive>
        </transition>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { abi } from 'thor-devkit/dist/abi'

interface TabItem {
    title: string
    sym: string
    loader: (offset: number, pageSize: number) => Promise<TransferItemData[]>
}

@Component({ name: 'AccountTransfers' })
export default class AccountTransfers extends Vue {
    private address = ''
    private tab = 0
    private get tabs(): TabItem[] {
        return [{
            title: 'VET',
            sym: 'VET',
            loader: async (offset, pageSize) => {
                const items = await this.$connex.thor.filter('transfer')
                    .criteria([{ sender: this.address }, { recipient: this.address }])
                    .order('desc')
                    .apply(offset, pageSize)
                return items.map(i => ({
                    from: i.sender,
                    to: i.recipient,
                    amount: i.amount,
                    timestamp: i.meta!.blockTimestamp,
                    owner: this.address,
                    txid: i.meta!.txID,
                }))
            }
        }, {
            title: 'VTHO',
            sym: 'VTHO',
            loader: async (offset, pageSize) => {
                const items = await this.$connex.thor
                    .account('0x0000000000000000000000000000456E65726779')
                    .event(vip180TransferEventABI)
                    .filter([{ from: this.address }, { to: this.address }])
                    .order('desc')
                    .apply(offset, pageSize)

                return items.map(i => ({
                    from: i.decoded!.from,
                    to: i.decoded!.to,
                    amount: i.decoded!.value,
                    timestamp: i.meta!.blockTimestamp,
                    owner: this.address,
                    txid: i.meta!.txID,
                }))
            }
        }]
    }

    private created() {
        this.address = this.$route.params.address.toLowerCase()
    }
}

const vip180TransferEventABI = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            name: 'from',
            type: 'address'
        },
        {
            indexed: true,
            name: 'to',
            type: 'address'
        },
        {
            indexed: false,
            name: 'value',
            type: 'uint256'
        }
    ],
    name: 'Transfer',
    type: 'event'
}
</script>
