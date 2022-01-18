/* eslint-disable import/prefer-default-export */

import ZkLadder from '@zkladder/zkladder-sdk-ts';

interface WalletStateInterface {
  address?:string[],
  balance?:number,
  provider?:any,
  chainId?:number,
  isConnected:boolean,
  zkLadder?:ZkLadder,
  reason?:string
}

export type { WalletStateInterface };
