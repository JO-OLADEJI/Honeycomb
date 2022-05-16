// constants
import { SUPPORTED_NETWORKS, networks } from 'constants/networks';

// types
import { WALLET_ERRORS } from 'types/errors';
import { EIP747 } from 'types/tokens';


export const connectWallet = async (): Promise<string>  => {
  const { ethereum } = window as any;

  if (ethereum) {
    try {
      const addresses: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
      return addresses[0];
    }
    catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      return '';
    }
  }
  else {
    console.log('metamask not installed❌');
    return '';
  }
}


export const getChainId = async (): Promise<string> => {
  const { ethereum } = window as any;

  if (ethereum) {
    try {
      const chain: string = await ethereum.request({ method: 'eth_chainId' });
      return chain;
    }
    catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      return '';
    }
  }
  else {
    console.error('metamask not installed❌');
    return '';
  }
}


export const refreshConnectWallet = async (): Promise<string> => {
  const { ethereum } = window as any;

  if (ethereum) {
    try {
      const addresses: string[] = await ethereum.request({ method: 'eth_accounts' });
      return addresses.length > 0 ? addresses[0] : '';
    }
    catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      return '';
    }
  }
  else {
    console.error('metamask not installed❌');
    return '';
  }
}


export const requestSwitchNetwork = async (
  network: SUPPORTED_NETWORKS
): Promise<boolean> => {
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
      if (typeof err === 'object') {
        if (err && (err as any).code === WALLET_ERRORS.CHAIN_NOT_FOUND) {
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
        return false;
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


export const requestAddERC20Token = async (
  address: string, symbol: string, decimals = 18, imageUrl = ''
): Promise<void> => {
  const { ethereum } = window as any;
  if (!ethereum) return;
  
  try {
    const ERC20Token: EIP747 = {
      type: 'ERC20',
      options: {
        address,
        symbol,
        decimals,
        image: imageUrl
      }
    }
    const success = await ethereum.request({ 
      method: 'wallet_watchAsset',
      params: ERC20Token
    });
    success ?
      console.log(`${symbol} added to Metamask✔`) :
      console.error(`Error adding ${symbol} to Metamask❌`);
  }
  catch (err) {
    if (err instanceof Error)
      console.error(err.message);
  }
  return;
}

