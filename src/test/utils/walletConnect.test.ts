import { connect, disconnect, apiSession } from '../../utils/walletConnect';
import signAuthKey from '../../utils/signAuthKey';
import { createSession, deleteSession } from '../../utils/api';

const mockRequest = jest.fn();

Object.defineProperty(window, 'location', {
  configurable: true,
  writable: true,
  value: { reload: jest.fn() },
});

jest.mock('web3modal', () => (jest.fn(() => ({
  connect: () => ({
    request: mockRequest,
  }),
  clearCachedProvider: jest.fn(),
}))));

jest.mock('../../utils/signAuthKey', () => (jest.fn()));
jest.mock('../../utils/api', () => ({
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

const mockSignAuthKey = signAuthKey as jest.Mocked<any>;
const mockCreateSession = createSession as jest.Mocked<any>;
const mockDeleteSession = deleteSession as jest.Mocked<any>;

describe('connect function', () => {
  test('connect function calls dependencies and returns correct response', async () => {
    mockRequest.mockResolvedValueOnce({})
      .mockResolvedValueOnce(['0xmockAddress'])
      .mockResolvedValueOnce({ toString: () => ('0x123') }) // chainId
      .mockResolvedValueOnce({ toString: () => ('0x2020') }); // balance

    const result = await connect();

    expect(mockRequest).toHaveBeenCalledTimes(4);
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'eth_accounts',
    });
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'eth_chainId',
    });
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'eth_getBalance',
      params: ['0xmockAddress', 'latest'],
    });
    expect(result).toStrictEqual({
      address: ['0xmockAddress'],
      balance: 8224,
      chainId: 291,
      provider: { request: mockRequest },

    });
  });
});

describe('apiSession function', () => {
  test('apiSession function calls dependencies and returns correct response', async () => {
    mockSignAuthKey.mockResolvedValueOnce('BASE64ENCODEDMOCKSIGNATURE');

    const result = await apiSession({ mock: 'provider' }, ['0xmockAddress']);

    expect(mockSignAuthKey).toHaveBeenCalledWith({ mock: 'provider' }, '0xmockAddress');
    expect(mockCreateSession).toHaveBeenCalledWith('BASE64ENCODEDMOCKSIGNATURE');
    expect(result).toBe(undefined);
  });
});

describe('disconnect function', () => {
  test('disconnect function calls dependencies and returns correct response', async () => {
    const result = await disconnect();

    expect(mockDeleteSession).toHaveBeenCalledTimes(1);
    expect(window.location.reload as jest.Mocked<any>).toHaveBeenCalledTimes(1);
    expect(result).toBe(undefined);
  });
});
