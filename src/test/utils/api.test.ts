import axios from 'axios';
import {
  request, getSession, createSession, deleteSession, storeVoucher, getVoucher, createContract, getContract, getTransactions,
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
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
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
      expect(error).toStrictEqual(new Error('API error'));
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
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
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
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
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
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ session: 'mocked' });
  });
});

describe('storeVoucher tests', () => {
  test('storeVoucher correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { voucher: 'mocked' } });

    const voucherOptions = {
      contractAddress: '0xcontract',
      userAddress: '0xuser',
      balance: 10,
      chainId: '123',
      signedVoucher: { mock: 'voucher' },
      roleId: 'mockRole',
    };
    const response = await storeVoucher(voucherOptions);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'post',
      url: '/v1/vouchers',
      data: voucherOptions,
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ voucher: 'mocked' });
  });
});

describe('getVoucher tests', () => {
  test('getVoucher correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { voucher: 'mocked' } });

    const voucherOptions = {
      contractAddress: '0xcontract',
      userAddress: '0xuser',
      chainId: 10,
      roleId: 'mockRole',
    };
    const response = await getVoucher(voucherOptions);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/vouchers',
      params: voucherOptions,
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ voucher: 'mocked' });
  });
});

describe('createContract tests', () => {
  test('createContract correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { contract: 'mocked' } });

    const contractOptions = {
      address: '0xcontract',
      creator: '0xuser',
      chainId: '10',
      templateId: '123',
    };
    const response = await createContract(contractOptions);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'post',
      url: '/v1/contracts',
      data: contractOptions,
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ contract: 'mocked' });
  });
});

describe('getContract tests', () => {
  test('getContract correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { contract: 'mocked' } });

    const contractOptions = {
      address: '0xcontract',
      creator: '0xuser',
      chainId: '10',
    };
    const response = await getContract(contractOptions);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/contracts',
      params: contractOptions,
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ contract: 'mocked' });
  });
});

describe('getTransactions tests', () => {
  test('getTransactions correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { transactions: 'mocked' } });

    const options = {
      address: '0xcontract',
      chainId: '10',
    };
    const response = await getTransactions(options);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/data/transactions',
      params: options,
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ transactions: 'mocked' });
  });
});
