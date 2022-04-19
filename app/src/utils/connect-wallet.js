export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return addresses[0];
    }
    catch (err) {
      console.log(err.message);
      return null;
    }
  }
  else {
    console.log('metamask not installed❌');
  }
}

export const getChainId = async () => {
  try {
    return await window.ethereum.request({ method: 'eth_chainId' });
  }
  catch (err) {
    console.log(err.message);
  }
}

/**
 * for getting wallet info (page refresh and re-visit) if site is already connected
 */
export const refreshConnectWallet = async () => {
  try {
    const addresses = await window.ethereum.request({ method: 'eth_accounts' });
    if (addresses.length > 0) {
      return addresses[0];
    }
    return null;
  }
  catch (err) {
    console.log(err.message);
  }
}


export const networks = {

  'ganache': {
    chainId: `0x${Number(1337).toString(16)}`,
    chainName: 'Ganache Local',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['http://127.0.0.1:7545']
  },

  'rinkeby': {
    chainId: `0x${Number(4).toString(16)}`,
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


/**
 * function to switch network to rinkeby or ganache
 * @param {String} network name of network to swith to. supports 'ganache' and 'rinkeby'
 */
export const requestSwitchNetwork = async (network) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networks[network]['chainId']}]
    });
    return true;
  }
  catch (err) {
    if (err.code === 4902) { // This error code indicates that the chain has not been added to MetaMask.
      try {
        await window.ethereum.request({
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