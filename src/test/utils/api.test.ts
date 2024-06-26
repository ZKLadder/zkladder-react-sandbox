import axios from 'axios';
import {
  request,
  getSession,
  createSession,
  deleteSession,
  storeVoucher,
  getVoucher,
  getAllVouchers,
  createContract,
  getContract,
  getTransactions,
  updateContract,
  createDrop,
  getDrops,
  updateDrop,
  uploadAssets,
  deleteAssets,
  activateVoucherService,
  getMinterAddress,
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

describe('getAllVouchers tests', () => {
  test('getAllVouchers correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { voucher: 'mocked' } });

    const voucherOptions = {
      contractAddress: '0xcontract',
      userAddress: '0xuser',
      chainId: 10,
      roleId: 'mockRole',
    };
    const response = await getAllVouchers(voucherOptions);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/vouchers/all',
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

describe('updateContract tests', () => {
  test('updateContract correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { contract: 'mocked' } });

    const contractOptions = {
      address: '0xcontract',
      admins: ['0xadmin'],
      chainId: '1',
      projectId: '123',
    };
    const response = await updateContract(contractOptions);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'patch',
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

describe('createDrop tests', () => {
  test('createDrop correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { transactions: 'mocked' } });

    const options = {
      contractAddress: '0xcontract',
      chainId: '10',
      tierId: 2,
    };
    const response = await createDrop(options);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'post',
      url: '/v1/drops',
      data: options,
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ transactions: 'mocked' });
  });
});

describe('getDrops tests', () => {
  test('getDrops correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { transactions: 'mocked' } });

    const options = {
      contractAddress: '0xcontract',
      chainId: '10',
    };
    const response = await getDrops(options);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/drops',
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

describe('updateDrop tests', () => {
  test('updateDrop correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { transactions: 'mocked' } });

    const options = {
      id: 1,
      tierId: 23,
      totalTokens: 100,
      chainId: '123',
      contractAddress: '0xmockaddress',
    };
    const response = await updateDrop(options);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'patch',
      url: '/v1/drops',
      data: options,
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ transactions: 'mocked' });
  });
});

describe('uploadAssets tests', () => {
  test('uploadAssets correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { transactions: 'mocked' } });

    const options = {
      chainId: '123',
      contractAddress: '0xmockaddress',
      assets: [
        { tokenUri: 'ipfs://123456789', dropId: 123 },
      ],
    };
    const response = await uploadAssets(options);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'post',
      url: '/v1/assets',
      data: options,
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ transactions: 'mocked' });
  });
});

describe('deleteAssets tests', () => {
  test('deleteAssets correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { transactions: 'mocked' } });

    const options = {
      assetIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      chainId: '123',
      contractAddress: '0xmockaddress',
    };
    const response = await deleteAssets(options);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'delete',
      url: '/v1/assets',
      data: options,
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ transactions: 'mocked' });
  });
});

describe('activateVoucherService tests', () => {
  test('activateVoucherService correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { transactions: 'mocked' } });

    const options = {
      contractAddress: '0x123', chainId: '1',
    };
    const response = await activateVoucherService(options);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'post',
      url: '/v1/vouchers/activate',
      data: options,
      headers: {
        Accept: '*/*',
      },
      baseURL: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
      withCredentials: true,
    });

    expect(response).toStrictEqual({ transactions: 'mocked' });
  });
});

describe('getMinterAddress tests', () => {
  test('getMinterAddress correctly calls dependencies and returns correct response', async () => {
    mockAxios.request.mockResolvedValueOnce({ data: { transactions: 'mocked' } });

    const options = {
      minterKeyId: '12345',
    };
    const response = await getMinterAddress(options);

    expect(axios.request).toHaveBeenCalledWith({
      method: 'get',
      url: '/v1/vouchers/address',
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
