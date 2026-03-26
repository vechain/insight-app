// Replaces node_modules/thor-devkit/esm/abi.js via Vite resolveId plugin.
// Uses @ethersproject/abi (ethers v5, pure-JS BigNumber) instead of ethers v6,
// which uses native BigInt — incompatible with Chrome 66.
export { abi } from '../utils/abi'
