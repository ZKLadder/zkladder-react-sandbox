import { atom, selector } from 'recoil';
import { MemberNft, MemberNftV2 } from '@zkladder/zkladder-sdk-ts';
import { Contract, ContractWithMetadata } from '../interfaces/contract';
import { getAllVouchers, getMinterAddress } from '../utils/api';
import { generateNftMetrics, nftContractRevenueAndTransfers, getOwnerBalances } from '../utils/blockchainData';
import { contractAddressSearch, networkFiltersState } from './page';
import config from '../config';
import { walletState } from './wallet';

const selectedContractState = atom({
  key: 'selectedContract',
  default: {
    address: null,
    templateId: null,
    chainId: null,
  } as {address:null|string, templateId:null|string, chainId:null|string},
});

const contractsState = atom({
  key: 'contracts',
  default: [] as Contract[],
});

const filteredContractsState = selector({
  key: 'filteredContracts',
  get: ({ get }) => {
    const searchAddress = get(contractAddressSearch);
    const networkFilters = get(networkFiltersState);
    let contracts = get(contractsState);

    if (searchAddress.length === 42) {
      contracts = contracts.filter((contract) => contract.address === searchAddress.toLowerCase());
    }

    contracts = contracts.filter((contract) => networkFilters.includes(contract.chainId));

    return contracts;
  },
});

const contractsWithMetadataState = selector({
  key: 'contractsWithMetadata',
  dangerouslyAllowMutability: true,
  get: async ({ get }) => {
    const contracts = get(contractsState);

    // Fetch metadata for each contract in the contractState array
    const promises = contracts.map(async (record) => {
      // Contract is a MemberNftV1
      if (record.templateId === '1') {
        const memberNft = await MemberNft.setup({
          address: record.address,
          chainId: parseInt(record.chainId, 10),
          infuraIpfsProjectId: config.ipfs.projectId,
          infuraIpfsProjectSecret: config.ipfs.projectSecret,
        });
        const contractMetadata = await memberNft.getCollectionMetadata();
        const totalSupply = await memberNft.totalSupply();
        const isTransferable = await memberNft.isTransferrable();
        const royaltyBasis = await memberNft.royaltyBasis();
        const royaltyPercent = royaltyBasis * 0.01;
        const beneficiary = await memberNft.beneficiaryAddress();
        const adminAccounts = await memberNft.getRoleMembers('DEFAULT_ADMIN_ROLE');
        const minterAccounts = await memberNft.getRoleMembers('MINTER_ROLE');

        return {
          ...record,
          ...contractMetadata,
          memberNft,
          totalSupply,
          isTransferable,
          royaltyBasis,
          royaltyPercent,
          beneficiary,
          adminAccounts,
          minterAccounts,
        };
      }
      // Contract is a MemberNftV2
      if (record.templateId === '3') {
        const memberNft = await MemberNftV2.setup({
          address: record.address,
          chainId: parseInt(record.chainId, 10),
          infuraIpfsProjectId: config.ipfs.projectId,
          infuraIpfsProjectSecret: config.ipfs.projectSecret,
        });
        const contractMetadata = await memberNft.getCollectionMetadata();
        const totalSupply = await memberNft.totalSupply();
        const beneficiary = await memberNft.beneficiaryAddress();
        const adminAccounts = await memberNft.getRoleMembers('DEFAULT_ADMIN_ROLE');
        const minterAccounts = await memberNft.getRoleMembers('MINTER_ROLE');
        const tiers = await memberNft.getTiers();

        const { minterKeyId } = record;
        let minterAddress;
        if (minterKeyId) {
          minterAddress = (await getMinterAddress({ minterKeyId })).address;
        }

        return {
          ...record,
          ...contractMetadata,
          memberNft,
          totalSupply,
          tiers,
          beneficiary,
          adminAccounts,
          minterAccounts,
          minterAddress,
        };
      }

      // TemplateId is not supported (should never reach this case)
      throw new Error('Unsupported contract type');
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

const allMetricsState = selector({
  key: 'allMetrics',
  get: async ({ get }) => {
    const contracts = get(contractsWithMetadataState);
    const metrics = await generateNftMetrics(Object.values(contracts));
    return metrics;
  },
});

const contractMetricsState = selector({
  key: 'contractMetrics',
  get: async ({ get }) => {
    const contracts = get(contractsWithMetadataState);
    const { address } = get(selectedContractState);
    const selectedContract = Object.values(contracts).find(
      (contract) => (contract.address.toLowerCase() === address?.toLowerCase()),
    );

    if (selectedContract) {
      const uniqueHolders = Object.keys(await getOwnerBalances(selectedContract)).length;
      const metrics = await nftContractRevenueAndTransfers(selectedContract);
      return { ...metrics, uniqueHolders, totalSupply: selectedContract.totalSupply };
    }
    return {};
  },
});

const WhitelistState = selector({
  key: 'whitelist',
  get: async ({ get }) => {
    const { address } = get(selectedContractState);
    const vouchers = await getAllVouchers({ contractAddress: address as string });
    return vouchers;
  },
});

const writableContractState = selector({
  key: 'writableContract',
  dangerouslyAllowMutability: true,
  get: async ({ get }) => {
    const { chainId, provider } = get(walletState);
    const contracts = get(contractsWithMetadataState);
    const { address } = get(selectedContractState);
    const selectedContract = Object.values(contracts).find(
      (contract) => (contract.address.toLowerCase() === address?.toLowerCase()),
    );

    if (selectedContract?.chainId === chainId?.toString() && selectedContract?.templateId === '1') {
      return MemberNft.setup({
        provider,
        address: selectedContract?.address as string,
        infuraIpfsProjectId: config.ipfs.projectId,
        infuraIpfsProjectSecret: config.ipfs.projectSecret,
      });
    }

    if (selectedContract?.chainId === chainId?.toString() && selectedContract?.templateId === '3') {
      return MemberNftV2.setup({
        provider,
        address: selectedContract?.address as string,
        infuraIpfsProjectId: config.ipfs.projectId,
        infuraIpfsProjectSecret: config.ipfs.projectSecret,
      });
    }

    return undefined;
  },
});

export {
  selectedContractState,
  contractsState,
  contractsWithMetadataState,
  filteredContractsState,
  allMetricsState,
  contractMetricsState,
  WhitelistState,
  writableContractState,
};
