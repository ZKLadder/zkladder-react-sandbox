/* eslint-disable import/prefer-default-export */

interface WalletStateInterface {
  address?:string[],
  balance?:number,
  provider?:any,
  chainId?:number,
  isConnected:boolean,
  isMember:boolean,
  reason?:string,
  memberToken?:{ [key: string]: any },
}

export type { WalletStateInterface };
