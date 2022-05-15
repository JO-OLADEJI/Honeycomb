export const shortenAddress = (address) => {
  return String(address).substring(0, 5) + '...' + String(address).substring(38);
}