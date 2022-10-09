import axios from 'axios';
import {
  HttpOptions,
  StoreVoucherOptions,
  GetVoucherOptions,
  CreateContractOptions,
  GetContractOptions,
  UpdateContractOptions,
  GetTransactionsOptions,
  SearchVoucherOptions,
  GetAccessSchemasOptions,
  CreateAccessSchemaOptions,
  UpdateAccessSchemaOptions,
  GetDropOptions,
  UpdateDropOptions,
  UploadAssetsOptions,
  DeleteAssetOptions,
} from '../interfaces/api';
import config from '../config';

/**
 * Generalized request wrapper used by other ZKL API functions
 * For a full list of endpoints: @TODO add API doc URL here
 * @param options input object holding function parameters
 */
const request = async (options: HttpOptions) => {
  try {
    const response = await axios.request({
      ...options,
      headers: {
        ...options.headers,
        Accept: '*/*',
      },
      baseURL: config.api.url,
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'API error');
  }
};

const getSession = async () => {
  const response = await request({
    method: 'get',
    url: '/v1/sessions',
  });
  return response;
};

const createSession = async (signature:string) => {
  const response = await request({
    method: 'post',
    url: '/v1/sessions',
    data: { signature },
  });
  return response;
};

const deleteSession = async () => {
  const response = await request({
    method: 'delete',
    url: '/v1/sessions',
  });
  return response;
};

const storeVoucher = async (options: StoreVoucherOptions) => {
  const response = await request({
    method: 'post',
    url: '/v1/vouchers',
    data: options,
  });
  return response;
};

const getVoucher = async (options: GetVoucherOptions) => {
  const response = await request({
    method: 'get',
    url: '/v1/vouchers',
    params: options,
  });
  return response;
};

const getAllVouchers = async (options: SearchVoucherOptions) => {
  const response = await request({
    method: 'get',
    url: '/v1/vouchers/all',
    params: options,
  });
  return response;
};

const createContract = async (options: CreateContractOptions) => {
  const response = await request({
    method: 'post',
    url: '/v1/contracts',
    data: options,
  });

  return response;
};

const getContract = async (options: GetContractOptions) => {
  const response = await request({
    method: 'get',
    url: '/v1/contracts',
    params: options,
  });

  return response;
};

const updateContract = async (options: UpdateContractOptions) => {
  const response = await request({
    method: 'patch',
    url: '/v1/contracts',
    data: options,
  });

  return response;
};

const getTransactions = async (options: GetTransactionsOptions) => {
  const response = await request({
    method: 'get',
    url: '/v1/data/transactions',
    params: options,
  });

  return response;
};

const getAccessSchemas = async (options: GetAccessSchemasOptions) => {
  const response = await request({
    method: 'get',
    url: '/v1/accessSchemas',
    params: options,
  });

  return response;
};

const createAccessSchema = async (options: CreateAccessSchemaOptions) => {
  const response = await request({
    method: 'post',
    url: '/v1/accessSchemas',
    data: options,
  });

  return response;
};

const updateAccessSchema = async (options: UpdateAccessSchemaOptions) => {
  const response = await request({
    method: 'patch',
    url: '/v1/accessSchemas',
    data: options,
  });

  return response;
};

const createDrop = async (options: UpdateDropOptions) => {
  const response = await request({
    method: 'post',
    url: '/v1/drops',
    data: options,
  });

  return response;
};

const getDrops = async (options: GetDropOptions) => {
  const response = await request({
    method: 'get',
    url: '/v1/drops',
    params: options,
  });

  return response;
};

const updateDrop = async (options: UpdateDropOptions) => {
  const response = await request({
    method: 'patch',
    url: '/v1/drops',
    data: options,
  });

  return response;
};

const uploadAssets = async (options: UploadAssetsOptions) => {
  const response = await request({
    method: 'post',
    url: '/v1/assets',
    data: options,
  });

  return response;
};

const deleteAssets = async (options: DeleteAssetOptions) => {
  const response = await request({
    method: 'delete',
    url: '/v1/assets',
    data: options,
  });

  return response;
};

const activateVoucherService = async (options: {contractAddress:string, chainId:string}) => {
  const response = await request({
    method: 'post',
    url: '/v1/vouchers/activate',
    data: options,
  });

  return response;
};

const getMinterAddress = async (options: {minterKeyId:string}) => {
  const response = await request({
    method: 'get',
    url: '/v1/vouchers/address',
    params: options,
  });

  return response;
};

export {
  getSession,
  createSession,
  deleteSession,
  storeVoucher,
  getVoucher,
  getAllVouchers,
  createContract,
  getContract,
  updateContract,
  getTransactions,
  getAccessSchemas,
  createAccessSchema,
  updateAccessSchema,
  createDrop,
  getDrops,
  updateDrop,
  uploadAssets,
  deleteAssets,
  activateVoucherService,
  getMinterAddress,
  // exported for unit testing
  request,
};
