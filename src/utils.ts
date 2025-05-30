export function genesisIdToNetwork(id: string) {
  switch (id) {
    case "0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a":
      return "main";
    case "0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127":
      return "test";
    case "0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6":
      return "solo";
    default:
      return "custom";
  }
}

export function networkToGenesisId(net: string) {
  switch (net) {
    case "main":
      return "0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a";
    case "test":
      return "0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127";
    case "solo":
      return "0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6";
    default:
      return "";
  }
}

export const genesisIdToGalacticaNumber = (id: string) => {
  switch (id) {
    case "0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a":
      return 22084200;
    case "0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127":
      return 21770500;
    default:
      return -1;
  }
}
