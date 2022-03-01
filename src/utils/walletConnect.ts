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
      rpc: {
        137: 'https://matic-mainnet.chainstacklabs.com',
      },
    },
  },
  'custom-walletlink': {
    display: {
      logo: 'https://media-exp1.licdn.com/dms/image/C560BAQHsPlWyC0Ksxg/company-logo_200_200/0/1620063222443?e=2159024400&v=beta&t=OgyA4B7O1XGHCfGbnbf1uIYZ6BEMo7864JRJqL6JUaY',
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

const connect = async (requestPermissions:boolean = true) => {
  // Brings up the web3 wallet select modal
  const provider = await web3Modal.connect();

  // Requests permissions (displays 'Select Accounts' popup)
  if (requestPermissions) { // requestPermissions === false anywhere this function is called by a useEffect on load
    try {
      await provider.request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
    } catch (err:any) {
      // Metamask user hit 'reject'
      if (err.message === 'User rejected the request.') throw new Error(err.message);

      // Otherwise 'requestPermissions' RPC method likely not supported
    }
  }

  // Get connected accounts (as an array of account strings)
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
  const session = await createSession(signature);
  return session;
};

const disconnect = async () => {
  await web3Modal.clearCachedProvider();
  await deleteSession();
  window.location.reload();
};

const switchChain = async (provider:any, chainId:string) => {
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: `0x${parseInt(chainId, 10).toString(16)}`,
      },
    ],
  });
};

export {
  connect, disconnect, apiSession, switchChain,
};
