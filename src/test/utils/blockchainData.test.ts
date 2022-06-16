import {
  nftContractTotalMinted,
  nftContractSecondaryTransfers,
  nftContractRevenue,
  nftContractRevenueAndTransfers,
  generateNftMetrics,
  getOwnerBalances,
} from '../../utils/blockchainData';
import { ethZeroAddress } from '../../constants/address';
import { getTransactions } from '../../utils/api';

jest.mock('../../utils/api', () => ({
  getTransactions: jest.fn(),
}));

const contracts = [
  { totalSupply: 5 },
  { totalSupply: 25 },
  { totalSupply: 100 },
  { totalSupply: 2 },
  { totalSupply: 3 },
] as any;

const transaction = {
  successful: true,
  value_quote: 12.34,
  log_events: [
    {
      decoded: {
        name: 'Transfer',
        params: [
          { name: 'from', value: '0x12345' },
          { name: 'to', value: '0x12345' },
        ],
      },
    },
    {
      decoded: {
        name: 'Transfer',
        params: [
          { name: 'from', value: ethZeroAddress },
          { name: 'to', value: '0x12345' },
        ],
      },
    },
  ],
};

const mockGetTransactions = getTransactions as jest.Mocked<any>;

describe('nftContractTotalMinted tests', () => {
  test('It returns the correct results', () => {
    expect(nftContractTotalMinted(contracts)).toBe(135);
  });
});

describe('nftContractSecondaryTransfers tests', () => {
  test('It returns the correct results', () => {
    expect(nftContractSecondaryTransfers(transaction)).toBe(1);
    expect(nftContractSecondaryTransfers({
      ...transaction,
      successful: false,
    })).toBe(0);
  });
});

describe('nftContractRevenue tests', () => {
  test('It returns the correct results', () => {
    expect(nftContractRevenue(transaction)).toBe(12.34);
    expect(nftContractRevenue({
      ...transaction,
      successful: false,
    })).toBe(0);
  });
});

describe('nftContractRevenueAndTransfers tests', () => {
  test('It returns the correct results', async () => {
    mockGetTransactions.mockResolvedValueOnce({
      data: {
        items: [
          { ...transaction, value_quote: 100.50 },
          { ...transaction, value_quote: 50.50 },
          { ...transaction, value_quote: 30.00 },
          { ...transaction, value_quote: 45.50 },
        ],
      },
    });
    expect(await nftContractRevenueAndTransfers({
      address: 'test',
      chainId: '137',
    } as any)).toStrictEqual({ contractRevenue: 226.5, transfers: 4 });
  });
});

describe('generateNftMetrics tests', () => {
  test('It returns the correct results', async () => {
    expect(await generateNftMetrics(contracts)).toStrictEqual({
      totalRevenue: '0.00', totalTrades: 0, totalMinted: 135, totalProjects: 5,
    });
  });
});

describe('getOwnerBalances tests', () => {
  const nfts:any = [
    { owner: 'one' },
    { owner: 'two' },
    { owner: 'two' },
    { owner: 'three' },
    { owner: 'three' },
    { owner: 'three' },
    { owner: 'four' },
    { owner: 'four' },
    { owner: 'four' },
    { owner: 'four' },
  ];

  const contract:any = {
    memberNft: {
      getAllTokens: jest.fn(),
    },
  };

  test('It returns the correct results when given an array of NFTs', async () => {
    expect(await getOwnerBalances(contract, nfts)).toStrictEqual({
      one: 1,
      two: 2,
      three: 3,
      four: 4,
    });
  });

  test('It correctly queries for NFTs', async () => {
    contract.memberNft.getAllTokens.mockResolvedValueOnce(nfts);

    const results = await getOwnerBalances(contract);

    expect(results).toStrictEqual({
      one: 1,
      two: 2,
      three: 3,
      four: 4,
    });

    expect(contract.memberNft.getAllTokens).toHaveBeenCalledTimes(1);
  });
});
