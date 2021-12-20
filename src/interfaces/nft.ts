interface NftStateInterface {
  isSelected:boolean,
  address?: string,
  instance?: any, // @TODO import the NFT module interface definition
  refreshCounter:number
}

interface NftContractMetadata {
  name?: string,
  symbol?: string,
  totalSupply?: string,
  address?: string
}

type Views = 'tokenQuery' | 'allTokens' | 'allMyTokens'

export type { NftStateInterface, NftContractMetadata, Views };
