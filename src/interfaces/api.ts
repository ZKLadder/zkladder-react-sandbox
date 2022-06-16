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

interface GetTransactionsOptions {
  address: string,
  chainId: string
}

export type {
  HttpOptions,
  StoreVoucherOptions,
  GetVoucherOptions,
  SearchVoucherOptions,
  CreateContractOptions,
  GetContractOptions,
  GetTransactionsOptions,
};
