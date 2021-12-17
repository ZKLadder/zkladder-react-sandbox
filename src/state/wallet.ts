/* eslint-disable import/prefer-default-export */
import { atom } from 'recoil';

const walletState = atom({
  key: 'walletState',
  default: { isConnected: false },
  dangerouslyAllowMutability: true,
});

export { walletState };
