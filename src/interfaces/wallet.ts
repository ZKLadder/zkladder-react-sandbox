/* eslint-disable import/prefer-default-export */

interface WalletStateInterface {
  address?:string[],
  balance?:number,
  provider?:any,
  chainId?:number,
  isConnected:boolean,
  reason?:string
}

export type { WalletStateInterface };
