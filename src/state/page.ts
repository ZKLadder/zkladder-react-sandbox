import { atom } from 'recoil';
import { LoadingStateInterface } from '../interfaces/page';
import networks from '../constants/networks';

const loadingState = atom({
  key: 'loadingState',
  default: { loading: false } as LoadingStateInterface,
});

const contractAddressState = atom({
  key: 'contractAddressState',
  default: '',
});

const networkFiltersState = atom({
  key: 'networkFiltersState',
  default: Object.keys(networks).map((chainId) => (chainId.toString())),
});

export { loadingState, contractAddressState, networkFiltersState };
