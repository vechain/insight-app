import Connex from "@vechain/connex/esm";

export const soloUrlNode = () => {
  //Used to support docker runtime env variables. This string is overrided on container startup using the injected env 
  if(process.env.VUE_APP_IS_DOCKER) {
      const soloUrlPlaceholder = 'VUE_APP_SOLO_URL_PLACEHOLDER';
      return soloUrlPlaceholder;
  }
  return process.env.VUE_APP_SOLO_URL;
}

export const isSoloNode = !!soloUrlNode();
export const nodeUrls = {
  main: "https://mainnet.vechain.org",
  test: "https://testnet.vechain.org",
  solo: soloUrlNode() ?? "http://localhost:8669",
  custom: "",
};

const soloGenesis = {
  number: 0,
  id: "0x00000000bb55405beed90df9fea5acdb1cb7caba61b0d7513395f42efd30e558",
  size: 180,
  parentID:
    "0xffffffff00000000000000000000000000000000000000000000000000000000",
  timestamp: 1526400000,
  gasLimit: 10000000,
  beneficiary: "0x0000000000000000000000000000000000000000",
  gasUsed: 0,
  totalScore: 0,
  txsRoot: "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
  txsFeatures: 0,
  stateRoot:
    "0xe27acf5fa834d6f148b2eba3ad3d7d51d0a31f2c185a4a2cddf7a37e26a5a8e4",
  receiptsRoot:
    "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
  signer: "0x0000000000000000000000000000000000000000",
  isTrunk: true,
  transactions: [],
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
