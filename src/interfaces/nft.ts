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
  tiers?: Tier[],
  external_link?: string,
  errors?:{ [key: string]: any }
}

interface Tier {
  tierId: number,
  royaltyBasis: number,
  salePrice:number,
  isTransferable: boolean
  name: string,
  description?:string,
  image?: Blob | string | null
}

interface NftMintParams {
  tierId:number,
  userAddress:string,
  metadata: {
    image?: File | string,
    name?:string,
    description?:string,
    tierName?:string,
    attributes?: { [key: string]: any }[]
  }
}

export type {
  NftStateInterface, NftContractMetadata, Views, NftContractUpdates, Tier, NftMintParams,
};
