import axios from 'axios';
import {
  HttpOptions,
  StoreVoucherOptions,
  GetVoucherOptions,
  CreateContractOptions,
  GetContractOptions,
  GetTransactionsOptions,
  SearchVoucherOptions,
  GetAccessSchemasOptions,
  CreateAccessSchemaOptions,
  UpdateAccessSchemaOptions,
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

export {
  getSession,
  createSession,
  deleteSession,
  storeVoucher,
  getVoucher,
  getAllVouchers,
  createContract,
  getContract,
  getTransactions,
  getAccessSchemas,
  createAccessSchema,
  updateAccessSchema,

  // exported for unit testing
  request,
};
