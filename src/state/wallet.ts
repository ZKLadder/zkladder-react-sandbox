import { atom } from 'recoil';
import { WalletStateInterface } from '../interfaces/wallet';

const walletState = atom({
  key: 'walletState',
  default: { isConnected: false } as WalletStateInterface,
  dangerouslyAllowMutability: true,
});

export { walletState };
