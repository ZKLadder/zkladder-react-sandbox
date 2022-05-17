import { atom, atomFamily, selector } from 'recoil';
import {
  NftStateInterface, NftContractMetadata, Views, NftContractUpdates,
} from '../interfaces/nft';
import { contractsWithMetadataState, selectedContractState } from './contract';

const viewState = atom({
  key: 'nftViewState',
  default: 'tokenQuery' as Views,
});

const nftState = atom({
  key: 'nftState',
  default: { isSelected: false, refreshCounter: 0 } as NftStateInterface,
  dangerouslyAllowMutability: true,
});

const nftContractMetadataState = selector({
  key: 'nftContractMetaDataState',
  get: async ():Promise<NftContractMetadata> => ({} as any)
  /* try {
      // const { instance } = get(nftState);
       if (instance) {
        const name = await instance.name();
        const symbol = await instance.symbol();
        const totalSupply = await instance.totalSupply();
        return {
          name, symbol, totalSupply, address: instance.address,
        };
      }
      return {} as any;
    } catch (error) {
      // @TODO potentially return a .error key
      return {};
    } */
  ,
});

const nftTokenState = atomFamily({
  key: 'nftTokenState',
  default: {} as { [key: string]: any },
});

const nftTokensEnumerable = selector({
  key: 'nftTokensEnumerable',
  get: async ({ get }) => {
    const contracts = get(contractsWithMetadataState);
    const selectedContract = get(selectedContractState);
    const nfts = [];
    for (let x = 0; x < contracts?.[selectedContract as string]?.totalSupply; x += 1) {
      nfts.push(get(nftTokenState(x)));
    }
    return nfts;
  },
});

const selectedNftState = atom({
  key: 'selectedNft',
  default: 0,
});

const nftSearchText = atom({
  key: 'nftSearchText',
  default: '',
});

const nftContractUpdates = atom({
  key: 'nftContractUpdates',
  default: {} as NftContractUpdates,
});

export {
  nftState,
  nftContractMetadataState,
  viewState,
  nftTokenState,
  nftTokensEnumerable,
  selectedNftState,
  nftSearchText,
  nftContractUpdates,
};
