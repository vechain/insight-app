import Connex from "@vechain/connex/esm";


export const soloUrlNode = () => {
    //Used to support docker runtime env variables. This string is overrided on container startup using the injected env 
    return "https://galactica.green.dev.node.vechain.org";
}

export const isSoloNode = !!soloUrlNode();
export const nodeUrls = {
  main: "https://mainnet.vechain.org",
  test: "https://testnet.vechain.org",
  solo: soloUrlNode() ?? "http://localhost:8669",
  custom: "",
};

const soloGenesis = {
  "number": 0,
  "id": "0x000000005639ad3ce1665a037d4da0f65f1dc32460c0e2a566b906893f6fe5e4",
  "size": 171,
  "parentID": "0xffffffff47616c616374696361204465766e6574000000000000000000000000",
  "timestamp": 1743437301,
  "gasLimit": 40000000,
  "beneficiary": "0x0000000000000000000000000000000000000000",
  "gasUsed": 0,
  "totalScore": 0,
  "txsRoot": "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
  "txsFeatures": 0,
  "stateRoot": "0x4b418645fbdd227e08d9457ce22284c61f714016e845bc65c738b351d8e89541",
  "receiptsRoot": "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
  "com": false,
  "signer": "0x0000000000000000000000000000000000000000",
  "isTrunk": true,
  "isFinalized": true,
  "transactions": []
};

export function createConnex(net?: "main" | "test" | "solo") {
  if (net) {
    // net specified
    const url = nodeUrls[net];
    if (net == "solo") {
      return new Connex({ node: url, network: soloGenesis });
    }
    return new Connex({ node: url, network: net });
  } else {
    const injected = (window as any).connex;
    // net unspecified
    if (injected) {
      return new Connex({ node: "", network: injected.thor.genesis });
    } else {
      // defaults to main net, or soloUrl if solo is provided
      if (isSoloNode) {
        return new Connex({ node: nodeUrls.solo, network: soloGenesis });
      }
      return new Connex({ node: nodeUrls.main });
    }
  }
}
