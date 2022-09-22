import { atom } from 'recoil';
import { Drop, DropUpdates } from '../interfaces/contract';

const currentDropState = atom({
  key: 'currentDropState',
  default: undefined as undefined | Drop,
});

const dropUpdatesState = atom({
  key: 'dropUpdatesState',
  default: {} as DropUpdates,
  dangerouslyAllowMutability: true,
});

export {
  currentDropState,
  dropUpdatesState,
};
