/* eslint-disable import/prefer-default-export */

interface WalletStateInterface {
  address?:string[],
  balance?:number,
  provider?:any,
  chainId?:string,
  isConnected: boolean
}

export type { WalletStateInterface };
