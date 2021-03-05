import Connex from '@vechain/connex/esm'

const nodeUrls = {
    main: 'https://explore-mainnet.veblocks.net',
    test: 'https://explore-testnet.veblocks.net'
}

export function createConnex(net?: 'main' | 'test') {
    if (net) { // net specified
        const url = nodeUrls[net]
        return new Connex({ node: url, network: net })
    } else {
        const injected = (window as any).connex
        // net unspecified
        if (injected) {
            return new Connex({ node: '', network: injected.thor.genesis })
        } else {
            // defaults to main net
            return new Connex({ node: nodeUrls.main })
        }
    }
}
