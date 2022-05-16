export interface EIP747 {
  type: string;
  options: {
    address: string;
    symbol?: string;
    decimals?: number;
    image?: string;
  };
}