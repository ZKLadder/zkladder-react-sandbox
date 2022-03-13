import { atom } from 'recoil';
import { LoadingStateInterface } from '../interfaces/page';

const loadingState = atom({
  key: 'loadingState',
  default: { loading: false } as LoadingStateInterface,
});

export { loadingState };
