import { atom } from 'recoil';
import { ErrorStateInterface, LoadingStateInterface } from '../interfaces/page';
import networks from '../constants/networks';

const loadingState = atom({
  key: 'loadingState',
  default: { loading: false } as LoadingStateInterface,
});

const errorState = atom({
  key: 'errorState',
  default: { showError: false } as ErrorStateInterface,
});

const contractAddressSearch = atom({
  key: 'contractAddressSearch',
  default: '',
});

const networkFiltersState = atom({
  key: 'networkFiltersState',
  default: Object.keys(networks).map((chainId) => (chainId.toString())),
});

const contractRefreshCounter = atom({
  key: 'refreshCounter',
  default: 0,
});

export {
  loadingState, errorState, contractAddressSearch, networkFiltersState, contractRefreshCounter,
};
