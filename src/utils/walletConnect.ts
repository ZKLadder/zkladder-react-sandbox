import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { WalletLink } from 'walletlink';
import signAuthKey from './signAuthKey';
import { createSession, deleteSession } from './api';

const providerOptions:any = {
  injected: {
    display: {
      name: 'Metamask',
      description: 'Connect with the provider in your Browser',
    },
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: '2d33fc4d9a9b4140b8582c1ef3bd12e8',
    },
  },
  'custom-walletlink': {
    display: {
      logo: 'https://raw.githubusercontent.com/walletlink/walletlink/master/web/src/images/wallets/coinbase-wallet.svg',
      name: 'Coinbase',
      description: 'Scan with WalletLink to connect',
    },
    options: {
      appName: 'ZKLadder', // Your app name
      networkUrl: 'https://mainnet.infura.io/v3/2d33fc4d9a9b4140b8582c1ef3bd12e8',
    },
    package: WalletLink,
    connector: async (_:any, options:any) => {
      const { appName, networkUrl, chainId } = options;
      const walletLink = new WalletLink({
        appName,
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      await provider.enable();
      return provider;
    },
  },
};

const web3Modal = new Web3Modal({
  providerOptions,
  cacheProvider: true,
});

const connect = async () => {
  // Brings up the web3 wallet select modal
  const provider = await web3Modal.connect();

  // Requests accounts (displays 'Connect Account' popup for firstime users)
  const address = await provider.request({ method: 'eth_accounts' });

  // Get chainId and user balance for display
  const chainId = await provider.request({ method: 'eth_chainId' });
  const balance = await provider.request(
    {
      method: 'eth_getBalance',
      params: [address?.[0], 'latest'],
    },
  );

  return {
    provider,
    address,
    balance: parseInt(balance.toString(16), 16),
    chainId: parseInt(chainId.toString(16), 16),
  };
};

const apiSession = async (provider:any, address:string[]) => {
  // Requests user signs 'Hello from ZKL' message
  const signature = await signAuthKey(provider, address?.[0]);

  // Creates a cookie storing the user generated signature
  await createSession(signature);
};

const disconnect = async () => {
  await web3Modal.clearCachedProvider();
  await deleteSession();
};

export { connect, disconnect, apiSession };
