import { atom } from 'recoil';
import { IpfsStateInterface } from '../interfaces/ipfs';

const ipfsState = atom({
  key: 'ipfsState',
  default: { exists: false } as IpfsStateInterface,
  dangerouslyAllowMutability: true,
});

const viewState = atom({
  key: 'viewState',
  default: { view: 'directoryView', cid: '', refreshCounter: 0 },
});

export { ipfsState, viewState };
