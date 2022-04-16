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