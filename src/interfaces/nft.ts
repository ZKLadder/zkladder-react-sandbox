import { MemberNft } from '@zkladder/zkladder-sdk-ts';
import { MemberNftRole } from './deploy';

interface NftStateInterface {
  isSelected:boolean,
  address?: string,
  instance?: MemberNft,
  refreshCounter:number
}

interface NftContractMetadata {
  name?: string,
  symbol?: string,
  totalSupply?: number,
  contractUri?:string,
  address?: string
}

type Views = 'tokenQuery' | 'allTokens' | 'allMyTokens'

interface NftContractUpdates {
  image?: any,
  description?: string,
  isTransferable?: boolean,
  royaltyBasis?: number,
  beneficiaryAddress?: string,
  roles?: MemberNftRole[],
  errors?:{ [key: string]: any }
}

export type {
  NftStateInterface, NftContractMetadata, Views, NftContractUpdates,
};
