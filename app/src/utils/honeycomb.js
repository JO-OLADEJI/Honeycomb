import { ethers  } from 'ethers';
import { contract } from './contract-config.js';

export const init = async (account) => {
  const provider = new ethers.providers.JsonRpcProvider('HTTP://127.0.0.1:7545');
  const signer = await provider.getSigner(account);
  const Honeycomb = new ethers.Contract(contract['address'], contract['abi'], signer);
  return Honeycomb;
}