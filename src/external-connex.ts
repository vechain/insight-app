import { DriverNoVendor } from '@vechain/connex.driver-nodejs/dist/driver-no-vendor'
import { SimpleNet } from '@vechain/connex.driver-nodejs/dist/simple-net'
import { Framework } from '@vechain/connex-framework'

class SimpleDriver extends DriverNoVendor {
    constructor() {
        const url = process.env.NODE_ENV === 'production' ?
            'https://sync-mainnet.vechain.org' : 'http://localhost:8669'

        super(new SimpleNet(url), {
            number: 0,
            id: '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
            size: 170,
            parentID: '0xffffffff53616c757465202620526573706563742c20457468657265756d2100',
            timestamp: 1530316800,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            stateRoot: '0x09bfdf9e24dd5cd5b63f3c1b5d58b97ff02ca0490214a021ed7d99b93867839c',
            receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0x0000000000000000000000000000000000000000',
            transactions: [],
            isTrunk: true
        })
    }
    public signTx(): any {
        throw new Error('Method not implemented.')
    }

    public signCert(): any {
        throw new Error('Method not implemented.')
    }

    public isAddressOwned(addr: string) {
        return Promise.resolve(false)
    }
}
import { connect } from '@vechain/connex.driver-nodejs/dist/virtual-driver'
export async function createConnex() {
    try {
        const vd = await connect('wss://local.vecha.in:10101')
        return new Framework(vd)
    } catch (err) {
        // tslint:disable-next-line: no-console
        console.warn('failed to connect virtual driver', err)
        return new Framework(new SimpleDriver())
    }
}
