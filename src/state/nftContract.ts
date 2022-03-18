import { atom, selector } from 'recoil';
import { NftStateInterface, NftContractMetadata, Views } from '../interfaces/nft';

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
  get: async ({ get }):Promise<NftContractMetadata> => {
    try {
      const { instance } = get(nftState);
      if (instance) {
        const name = await instance.name();
        const symbol = await instance.symbol();
        const totalSupply = await instance.totalSupply();
        const contractUri = await instance.contractUri();
        return {
          name, symbol, totalSupply, contractUri, address: instance.address,
        };
      }
      return {};
    } catch (error) {
      // @TODO potentially return a .error key
      return {};
    }
  },
});

export { nftState, nftContractMetadataState, viewState };
