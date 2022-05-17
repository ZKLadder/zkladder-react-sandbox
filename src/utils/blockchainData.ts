import { NftTokenData } from '@zkladder/zkladder-sdk-ts/dist/interfaces/nft';
import { ContractWithMetadata } from '../interfaces/contract';
import { getTransactions } from './api';
import { ethZeroAddress } from '../constants/address';
import networks from '../constants/networks';

/**
 * Sums the totalSupply value across a set of Nft contract objects
 * @param contracts An arbitrary length array of Nft contract objects with metadata
 * @returns total supply of minted NFT's across several individual contracts
 */
const nftContractTotalMinted = (contracts: ContractWithMetadata[]) => contracts.reduce(
  (total, contract) => (total + contract.totalSupply),
  0,
);

/**
 * Accepts a covalent API transaction object and sums the count of any secondary transfers (transfers where from && to !== Eth zero address)
 * @param transaction https://www.covalenthq.com/docs/api/#/0/Get%20transactions%20for%20address/USD/1
 * @returns Total count of transfer events in the transaction (normally 0 or 1)
 */
const nftContractSecondaryTransfers = (transaction: any) => {
  // If transaction was not successful then do not count any transfers
  if (!transaction.successful) return 0;

  let transfers = 0;
  // There can be multiple log events per transaction
  transaction?.log_events?.forEach((logRecord:any) => {
    // Log event refers to a transfer
    if (logRecord.decoded && logRecord.decoded.name === 'Transfer') {
      const { params } = logRecord.decoded;

      // Both to and from fields are valid addresses - indicating this is not a burn or mint event
      const from = params.find((param:any) => param.name === 'from').value;
      const to = params.find((param:any) => param.name === 'to').value;
      if (from !== ethZeroAddress && to !== ethZeroAddress) {
        transfers += 1;
      }
    }
  });
  return transfers;
};

/**
 * Accepts a covalent API transaction object and returns the value sent to the contract
 * @remarks Assumes that calls to Mint function are the only possible transactions that can have a value !== 0 && successful === true
 * @param transaction https://www.covalenthq.com/docs/api/#/0/Get%20transactions%20for%20address/USD/1
 * @returns Transaction value
 */
const nftContractRevenue = (transaction: any) => {
  // If transaction was not successful then do not count revenue
  if (!transaction.successful) return 0;

  // value_quote is denominated in USD with spot rate calculation performed by Covalent API
  return transaction.value_quote;
};

/**
 * Accepts a contract object with metadata and returns total contract revenue (from mints only) and sum count of secondary transfers
 * @remarks Makes an API call to the Covalent API (via ZKLadder backend)
 * @param contract Contract object
 * @returns contractRevenue and transfers
 */
const nftContractRevenueAndTransfers = async (contract: ContractWithMetadata) => {
  let contractRevenue = 0;
  let transfers = 0;

  if (!(networks as any)[contract.chainId].hide) {
    // Fetch array of transactions for this contract
    const { data } = await getTransactions({ address: contract.address, chainId: contract.chainId });

    // Loop through every transaction and aggregate transfers and revenue
    data.items.forEach((transaction:any) => {
      contractRevenue += nftContractRevenue(transaction);
      transfers += nftContractSecondaryTransfers(transaction);
    });
  }

  return { contractRevenue, transfers };
};

/**
 * Accepts an array of contract object with metadata and returns total contract revenue (from mints only) and sum count of secondary transfers
 * @param contracts Array of Nft contracts with metadata
 * @returns Total revenue and count of secondary transfers accross all contracts
 */
const totalRevenueAndTransfers = async (contracts: ContractWithMetadata[]) => {
  const promises = contracts.map(async (contract) => {
    const revenue = await nftContractRevenueAndTransfers(contract);
    return revenue;
  });

  let totalRevenue = 0;
  let totalTrades = 0;
  (await Promise.allSettled(promises)).forEach((promise) => {
    if (promise.status === 'fulfilled') {
      const { contractRevenue, transfers } = promise.value;
      totalRevenue += contractRevenue;
      totalTrades += transfers;
    }
  });

  return { totalRevenue, totalTrades };
};

/**
 * Calculates a set of data points aggregated across multiple NFT contracts
 * @param contracts Array of contract objects
 * @returns An object containing totalRevenue, totalTrades, totalMinted, and totalProjects.
 */
const generateNftMetrics = async (contracts: ContractWithMetadata[]) => {
  const { totalRevenue, totalTrades } = await totalRevenueAndTransfers(contracts);
  const totalMinted = nftContractTotalMinted(contracts);
  const totalProjects = contracts.length;

  return {
    totalRevenue: totalRevenue.toFixed(2),
    totalTrades,
    totalMinted,
    totalProjects,
  };
};

/**
 * Accepts an array of NFT's, and returns an owner indexed map of balances.
 * @param contract Valid contract object
 * @param nftTokens OPTIONAL - Array of NFT's to transform. If excluded the function will query for the NFT array.
 * @returns
 */
const getOwnerBalances = async (contract: ContractWithMetadata, nftTokens?:NftTokenData[]) => {
  const uniqueAddresses: { [key: string]: number } = {};

  let tokens;
  if (!nftTokens) {
    tokens = await contract.memberNft.getAllTokens();
  } else {
    tokens = nftTokens;
  }

  tokens.forEach((token) => {
    const owner = token?.owner?.toLowerCase() as string;
    if (uniqueAddresses[owner]) uniqueAddresses[owner] += 1;
    else uniqueAddresses[owner as string] = 1;
  });

  return uniqueAddresses;
};

export {
  generateNftMetrics,
  nftContractRevenue,
  nftContractSecondaryTransfers,
  nftContractRevenueAndTransfers,
  totalRevenueAndTransfers,
  nftContractTotalMinted,
  getOwnerBalances,
};
