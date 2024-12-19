
// vet.domain resolver
const vet_domainResolver = '0xA11413086e163e41901bb81fdc5617c975Fa5a1A'
const getNamesJsonAbi = {
  "inputs": [
    {
      "internalType": "address[]",
      "name": "addresses",
      "type": "address[]"
    }
  ],
  "name": "getNames",
  "outputs": [
    {
      "internalType": "string[]",
      "name": "names",
      "type": "string[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}
const getAddressesJsonAbi = {
  "inputs": [
    {
      "internalType": "string[]",
      "name": "names",
      "type": "string[]"
    }
  ],
  "name": "getAddresses",
  "outputs": [
    {
      "internalType": "address[]",
      "name": "addresses",
      "type": "address[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}

export const resolveDomainName = async (address: string, connex: Connex) => { 
    try {               
        const { decoded: { names } }  = await connex.thor
            .account(vet_domainResolver)
            .method(getNamesJsonAbi)
            .cache([address, vet_domainResolver])
            .call([address])

        return names[0] || null
    } catch {
        return null
    }
}

export const resolveAddressByName = async (name: string, connex: Connex) => { 
    try {               
        const { decoded: { addresses } }  = await connex.thor
            .account(vet_domainResolver)
            .method(getAddressesJsonAbi)
            .cache([vet_domainResolver])
            .call([name])

        return addresses[0] || null
    } catch {
        return null
    }
}

