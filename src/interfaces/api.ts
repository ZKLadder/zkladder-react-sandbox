import { AxiosRequestHeaders } from 'axios';

interface HttpOptions{
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  url: string; // path
  params?: object; // querystring parameters
  data?: object; // request body
  headers?: AxiosRequestHeaders; // request headers
}

interface StoreVoucherOptions{
  contractAddress: string,
  userAddress: string,
  balance:number,
  roleId:string,
  chainId:string,
  signedVoucher: { [key: string]: any }
}

interface GetVoucherOptions{
  contractAddress: string,
  userAddress: string,
  roleId:string,
  chainId:number,
}

interface SearchVoucherOptions{
  contractAddress?: string,
  userAddress?: string,
  roleId?:string,
  chainId?:number,
}

interface CreateContractOptions {
  address: string,
  creator: string,
  admins?: string[],
  chainId: string,
  templateId: string,
  projectId?: string,
}

interface GetContractOptions {
  address?: string,
  userAddress?: string,
  chainId?: string,
  projectId?: string,
}

interface UpdateContractOptions {
  address: string,
  chainId: string,
  admins?: string[],
  projectId?: string,
}

interface GetTransactionsOptions {
  address: string,
  chainId: string
}

interface GetAccessSchemasOptions {
  id?: string,
  creatorAddress?: string
}

interface CreateAccessSchemaOptions {
  name?:string,
  creatorAddress:string,
  accessSchema: { [key: string]: any; }[]
}

interface UpdateAccessSchemaOptions {
  id: number,
  name?: string,
  isArchived?: boolean,
  accessSchema?: { [key: string]: any; }[]
}

interface UpdateDropOptions {
  id?:number,
  tierId?:number,
  name?:string,
  startTime?: string,
  endTime?:string,
  accessSchemaId?:number,
  totalTokens?:number
 }

interface CreateDropOptions extends UpdateDropOptions {
 contractAddress:string,
 chainId:string,
}

interface GetDropOptions {
  id?:number,
  contractAddress?:string,
  chainId?:string
 }

 interface UploadAssetsOptions {
  assets:{
    dropId:number,
    tokenUri:string,
    isMinted?:boolean
  }[]
 }

 interface DeleteAssetOptions {
  assetIds: number[]
 }

export type {
  HttpOptions,
  StoreVoucherOptions,
  GetVoucherOptions,
  SearchVoucherOptions,
  CreateContractOptions,
  GetContractOptions,
  UpdateContractOptions,
  GetTransactionsOptions,
  GetAccessSchemasOptions,
  CreateAccessSchemaOptions,
  UpdateAccessSchemaOptions,
  CreateDropOptions,
  GetDropOptions,
  UpdateDropOptions,
  UploadAssetsOptions,
  DeleteAssetOptions,
};
