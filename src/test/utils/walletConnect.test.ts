import {
  connect, disconnect, apiSession, switchChain,
} from '../../utils/walletConnect';
import signAuthKey from '../../utils/signAuthKey';
import { createSession, deleteSession } from '../../utils/api';

const mockRequest = jest.fn();

Object.defineProperty(window, 'location', {
  configurable: true,
  writable: true,
  value: { reload: jest.fn() },
});

const storage = {
  getItem: jest.fn(),
  clear: jest.fn(),
  setItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  writable: true,
  value: storage,
});

jest.mock('@web3-onboard/core', () => (jest.fn(() => ({
  connectWallet: () => ([
    { label: 'MockWallet', provider: { request: mockRequest } },
  ]),
  disconnectWallet: jest.fn(),
  state: { get: () => ({ wallets: [{ label: 'MockWallet' }] }) },
  setChain: async () => (true),
}))));

jest.mock('@web3-onboard/injected-wallets', () => (jest.fn()));
jest.mock('@web3-onboard/walletlink', () => (jest.fn()));
jest.mock('@web3-onboard/ledger', () => (jest.fn()));
jest.mock('@web3-onboard/trezor', () => (jest.fn()));

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
    mockRequest.mockResolvedValueOnce(['0xmockAddress'])
      .mockResolvedValueOnce({ toString: () => ('0x123') }) // chainId
      .mockResolvedValueOnce({ toString: () => ('0x2020') }); // balance

    const result = await connect();

    expect(mockRequest).toHaveBeenCalledTimes(3);
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
    expect(window.localStorage.setItem).toHaveBeenCalledWith('CACHED_WALLET_CONNECTION', 'MockWallet');
  });

  test('connect function calls dependencies and returns correct response without request permissions', async () => {
    mockRequest.mockResolvedValueOnce(['0xmockAddress'])
      .mockResolvedValueOnce({ toString: () => ('0x123') }) // chainId
      .mockResolvedValueOnce({ toString: () => ('0x2020') }); // balance

    const result = await connect(false);

    expect(mockRequest).toHaveBeenCalledTimes(3);
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
    expect(window.localStorage.setItem).toHaveBeenCalledWith('CACHED_WALLET_CONNECTION', 'MockWallet');
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
    expect(window.localStorage.clear).toHaveBeenCalledTimes(1);
    expect(result).toBe(undefined);
  });
});

describe('switchChain function', () => {
  test('switchChain function calls dependencies and returns correct response', async () => {
    (window.localStorage.getItem as jest.Mocked<any>).mockReturnValueOnce('MockConnected');

    const result = await switchChain('5');

    expect(window.localStorage.getItem as jest.Mocked<any>).toHaveBeenCalledWith('CACHED_WALLET_CONNECTION');
    expect(result).toBe(true);
  });
});
