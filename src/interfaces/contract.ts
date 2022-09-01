import { MemberNftReadOnly, MemberNftV2ReadOnly } from '@zkladder/zkladder-sdk-ts';
import { MemberNftRole } from './deploy';
import { Tier } from './nft';

interface Contract {
  address:string,
  chainId:string,
  templateId:string,
  creator:string,
  admins:string[],
  projectId?:string
}

interface ContractWithMetadata extends Contract{
  name:string,
  symbol:string,
  description?:string,
  image?:string,
  totalSupply:number,
  whitelisted?:32,
  tiers?:Tier[],
  memberNft: MemberNftReadOnly | MemberNftV2ReadOnly,
  roles?:MemberNftRole[],
  adminAccounts?: string[],
  minterAccounts?: string[]
}

interface ContractMetrics {
  totalProjects:number,
  totalMinted:number,
  totalRevenue:string,
  totalTrades: number
}

interface MintVoucher {
  userAddress:string,
  createdAt:string,
  balance:number,
  note:string,
  roleId:string,
  redeemed?:boolean
}

interface Drop {
  id:number,
  contractAddress:string,
  chainId:string,
  tierId:number,
  name?:string,
  startTime?:string,
  endTime?:string,
  totalTokens?:number,
  isArchived?:boolean,
  assets: {id:number, tokenUri:string, isMinted:boolean}[]
}

export type {
  Contract, ContractWithMetadata, ContractMetrics, MintVoucher, Drop,
};
