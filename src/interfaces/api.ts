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
  chainId:string,
  signedVoucher: { [key: string]: any }
}

interface GetVoucherOptions{
  contractAddress: string,
  userAddress: string,
  chainId:number
}

export type { HttpOptions, StoreVoucherOptions, GetVoucherOptions };
