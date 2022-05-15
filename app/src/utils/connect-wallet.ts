import { networks } from '../constants/networks';
import { SUPPORTED_NETWORKS } from '../types/networks';
import { WALLET_ERRORS } from '../types/errors';


export const connectWallet = async (): Promise<string | null>  => {
  const { ethereum } = window as any;

  if (ethereum) {
    try {
      const addresses: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
      return addresses[0];
    }
    catch (err) {
      console.log(err.message);
      return null;
    }
  }
  else {
    console.log('metamask not installed❌');
    return null;
  }
}

export const getChainId = async (): Promise<string | null> => {
  const { ethereum } = window as any;

  if (ethereum) {
    try {
      const chain: string = await ethereum.request({ method: 'eth_chainId' });
      return chain;
    }
    catch (err) {
      console.error(err.message);
      return null;
    }
  }
  else {
    console.error('metamask not installed❌');
    return null;
  }
}

export const refreshConnectWallet = async (): Promise<string | null> => {
  const { ethereum } = window as any;

  if (ethereum) {
    try {
      const addresses: string[] = await ethereum.request({ method: 'eth_accounts' });
      return addresses.length > 0 ? addresses[0] : null;
    }
    catch (err) {
      console.error(err.message);
      return null;
    }
  }
  else {
    console.error('metamask not installed❌');
    return null;
  }
}

export const requestSwitchNetwork = async (network: SUPPORTED_NETWORKS): Promise<boolean> => {
  const { ethereum } = window as any;

  if (ethereum) {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networks[network]['chainId'] }]
      });
      return true;
    }
    catch (err) {
      if (err.code === WALLET_ERRORS.CHAIN_NOT_FOUND) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networks[network]]
          });
          return true;
        }
        catch (err) {
          return false;
        }
      }
      else {
        return false;
      }
    }
  }
  else {
    console.error('metamask not installed❌');
    return false;
  }
}

