import { toHexString } from '../utils/format-text';
import { SUPPORTED_NETWORKS, EIP3085 } from '../types/networks';


export const networks: { [network in SUPPORTED_NETWORKS]: EIP3085 } = {
  
  [SUPPORTED_NETWORKS.GANACHE]: {
    chainId: toHexString(SUPPORTED_NETWORKS.GANACHE),
    chainName: 'Ganache Local',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['http://127.0.0.1:7545']
  },

  [SUPPORTED_NETWORKS.RINKEBY]: {
    chainId: toHexString(SUPPORTED_NETWORKS.RINKEBY),
    chainName: 'Rinkeby Test Network',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io']
  }

}

