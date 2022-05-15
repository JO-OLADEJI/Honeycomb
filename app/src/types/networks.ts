export interface EIP3085 {
  chainId: string;
  blockExplorerUrls?: string[];
  chainName?: string;
  iconUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
}

export enum SUPPORTED_NETWORKS {
  RINKEBY = 4,
  GANACHE =  1337
}

