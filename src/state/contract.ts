import { atom, selector } from 'recoil';
import { MemberNft } from '@zkladder/zkladder-sdk-ts';
import { Contract, ContractWithMetadata } from '../interfaces/contract';
import { generateNftMetrics } from '../utils/blockchainData';
import { contractAddressState, networkFiltersState } from './page';
import config from '../config';

const contractState = atom({
  key: 'contracts',
  default: [] as Contract[],
});

const filteredContractsState = selector({
  key: 'filteredContracts',
  get: ({ get }) => {
    const searchAddress = get(contractAddressState);
    const networkFilters = get(networkFiltersState);
    let contracts = get(contractState);

    if (searchAddress.length === 42) {
      contracts = contracts.filter((contract) => contract.address === searchAddress.toLowerCase());
    }

    contracts = contracts.filter((contract) => networkFilters.includes(contract.chainId));

    return contracts;
  },
});

const contractWithMetadataState = selector({
  key: 'contractsWithMetadata',
  get: async ({ get }) => {
    const contracts = get(contractState);

    // Fetch metadata for each contract in the contractState array
    const promises = contracts.map(async (record) => {
      const memberNft = await MemberNft.setup({
        address: record.address,
        chainId: parseInt(record.chainId, 10),
        infuraIpfsProjectId: config.ipfs.projectId,
        infuraIpfsProjectSecret: config.ipfs.projectSecret,
      });
      const contractMetadata = await memberNft.getCollectionMetadata();
      const totalSupply = await memberNft.totalSupply();
      return { ...record, ...contractMetadata, totalSupply };
    });

    // Wait for all promises to resolve
    const results = await Promise.allSettled(promises);

    const newMetadata: { [key: string]: ContractWithMetadata } = {};

    results.forEach((promise) => {
      if (promise.status === 'fulfilled') {
        newMetadata[promise.value.address] = promise.value;
      }
    });

    return newMetadata;
  },
});

const contractMetricsState = selector({
  key: 'contractMetrics',
  get: async ({ get }) => {
    const contracts = get(contractWithMetadataState);
    const metrics = await generateNftMetrics(Object.values(contracts));
    return metrics;
  },
});

export {
  contractState, contractWithMetadataState, filteredContractsState, contractMetricsState,
};
