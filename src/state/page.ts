import { atom } from 'recoil';
import { ErrorStateInterface, LoadingStateInterface } from '../interfaces/page';
import networks from '../constants/networks';
import { Drop } from '../interfaces/contract';

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

const manageProjectsPageState = atom({
  key: 'manageProjectsPage',
  default: 'collection',
});

const dropSectionState = atom({
  key: 'dropSectionState',
  default: 'dropTable',
});

const currentDropState = atom({
  key: 'currentDropState',
  default: undefined as undefined | Drop,
});

// @TODO Remove this temporary atom when refactoring access schema components
const schemaPageState = atom({
  key: 'schemaPageState',
  default: { section: 'list' } as {section:string, schema?:any},
});

export {
  loadingState,
  errorState,
  contractAddressSearch,
  networkFiltersState,
  contractRefreshCounter,
  schemaPageState,
  dropSectionState,
  manageProjectsPageState,
  currentDropState,
};
