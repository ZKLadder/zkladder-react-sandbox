import axios from 'axios';
import { HttpOptions } from '../interfaces/api';

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
      baseURL: process.env.REACT_APP_ZKL_API || 'http://zkladder.us-east-1.elasticbeanstalk.com/api',
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const method = error.config?.method;
    const baseUrl = error.config?.baseURL;
    const path = error.config?.url;
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
