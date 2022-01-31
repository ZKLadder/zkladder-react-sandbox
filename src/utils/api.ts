import axios from 'axios';
import { HttpOptions } from '../interfaces/api';
import config from '../config';
/**
 * Generalized request wrapper used by other ZKL API functions
 * For a full list of endpoints:
 * @TODO add API doc URL here
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
    const method = error.config?.method;
    const baseUrl = error.config?.baseURL;
    const path = error.config?.url;
    if (error.status === 400) throw new Error('It appears your account does not have access');
    throw new Error(`${error.message}, Method:[${method}], URL:[${baseUrl}${path}]`);
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

export {
  getSession,
  createSession,
  deleteSession,

  // exported for unit testing
  request,
};
