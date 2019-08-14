export function network() {
    if (window.connex) {
        const gid = connex.thor.genesis.id
        if (gid === '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a') {
            return 'main'
        } else if (gid === '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127') {
            return 'test'
        } else if (gid === '0x00000000973ceb7f343a58b08f0693d6701a5fd354ff73d7058af3fba222aea4') {
            return 'solo'
        }
    }
    return 'custom'
}

export function veForgeBaseUrl() {
    switch (network()) {
        case 'main': return 'https://explore.veforge.com/'
        case 'test': return 'https://testnet.veforge.com/'
    }
}
