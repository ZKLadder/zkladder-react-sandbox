import { Nft } from '@zkladder/zkladder-sdk-ts';

interface NftStateInterface {
  isSelected:boolean,
  address?: string,
  instance?: Nft,
  refreshCounter:number
}

interface NftContractMetadata {
  name?: string,
  symbol?: string,
  totalSupply?: number,
  address?: string
}

type Views = 'tokenQuery' | 'allTokens' | 'allMyTokens'

export type { NftStateInterface, NftContractMetadata, Views };
