import { atom } from 'recoil';
import { WalletStateInterface } from '../interfaces/wallet';

const walletState = atom({
  key: 'walletState',
  default: { isConnected: false, isMember: false } as WalletStateInterface,
  dangerouslyAllowMutability: true,
});

export { walletState };
