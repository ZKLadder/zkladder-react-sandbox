import { MemberNft } from '@zkladder/zkladder-sdk-ts';

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

export type { NftStateInterface, NftContractMetadata, Views };
