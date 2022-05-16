export const shortenAddress = (address: string): string => {
  return String(address).substring(0, 5) + '...' + String(address).substring(38);
}

export const toHexString = (chain: number): string => {
  return `0x${Number(chain).toString(16)}`;
}

