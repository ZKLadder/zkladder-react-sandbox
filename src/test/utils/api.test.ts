import axios from 'axios';
import {
  request, getSession, createSession, deleteSession,
} from '../../utils/api';

jest.mock('axios', () => ({ request: jest.fn() }));

const mockAxios = axios as jest.Mocked<any>;

describe('Generic ZKL API request wrapper', () => {
  test('Calls axios with the correct parameters', async () => {
    mockAxios.request.mockResolvedValueOnce('test');

    await request({
      method: 'get',
      url: 'a/test/url',
    });

    expect(mockAxios.request).toHaveBeenCalledWith({
      method: 'get',
      url: 'a/test/url',
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'http://zkladder.us-east-1.elasticbeanstalk.com/api',
      withCredentials: true,
    });
  });

  test('Returns response data correctly', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: 'MockData' });

    const response = await request({
      method: 'get',
      url: 'a/test/url',
    });

    expect(response).toStrictEqual('MockData');
  });

  test('Rethrows axios errors correctly', async () => {
    mockAxios.request.mockRejectedValueOnce({
      message: 'Not working',
      config: {
        method: 'get',
        baseURL: 'a/base/url',
        url: 'a/test/url',
      },
    });

    try {
      await request({
        method: 'get',
        url: 'a/test/url',
      });
      expect(true).toBe(false); // should be unreachable
    } catch (error) {
      expect(error).toStrictEqual(new Error('Not working, Method:[get], URL:[a/base/urla/test/url]'));
    }
  });
});

describe('getSession tests', () => {
  test('getSession correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { session: 'mocked' } });

    const response = await getSession();

    expect(axios.request).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/sessions',
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'http://zkladder.us-east-1.elasticbeanstalk.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ session: 'mocked' });
  });
});

describe('createSession tests', () => {
  test('createSession correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { session: 'mocked' } });

    const response = await createSession('0xmockSig');

    expect(axios.request).toHaveBeenCalledWith({
      method: 'post',
      url: '/v1/sessions',
      headers: {
        Accept: '*/*',
      },
      data: {
        signature: '0xmockSig',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'http://zkladder.us-east-1.elasticbeanstalk.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ session: 'mocked' });
  });
});

describe('deleteSession tests', () => {
  test('deleteSession correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { session: 'mocked' } });

    const response = await deleteSession();

    expect(axios.request).toHaveBeenCalledWith({
      method: 'delete',
      url: '/v1/sessions',
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'http://zkladder.us-east-1.elasticbeanstalk.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ session: 'mocked' });
  });
});