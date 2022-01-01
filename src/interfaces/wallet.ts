/* eslint-disable import/prefer-default-export */

import ZkLadder from '@zkladder/zkladder-sdk-ts';

interface WalletStateInterface {
  address?:string[],
  balance?:number,
  provider?:any,
  chainId?:string,
  isConnected:boolean,
  zkLadder:ZkLadder
}

export type { WalletStateInterface };
