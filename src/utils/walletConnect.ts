import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
// import walletConnectModule from '@web3-onboard/walletconnect';
import walletLinkModule from '@web3-onboard/walletlink';
import ledgerModule from '@web3-onboard/ledger';
import trezorModule from '@web3-onboard/trezor';
import networks from '../constants/networks';
import signAuthKey from './signAuthKey';
import { createSession, deleteSession } from './api';

const appMetadata = {
  name: 'ZKLadder',
  icon: 'https://www.zkladder.com/media/logo-mobile-hover.png',
  description: 'Web3 Venture Studio',
  gettingStartedGuide: 'https://zkladder.com',
};

const languageOverrides = {
  en: {
    connect: {
      selectingWallet: {
        header: '',
        sidebar: {
          heading: '',
          subheading: 'Welcome from your friends at ZKLadder',
          paragraph: 'Please select one of our supported wallets to continue',
        },
      },
    },
  },
};

const injected = injectedModule();
// const walletConnect = walletConnectModule();
const walletLink = walletLinkModule();
const ledger = ledgerModule();
const trezor = trezorModule({
  email: 'info@zkladder.com',
  appUrl: 'https://app.zkladder.com',
});

const onboard = Onboard({
  appMetadata,
  chains: Object.values(networks).map((chain) => ({
    label: chain.label,
    token: chain.token,
    id: chain.id,
    rpcUrl: chain.rpcUrl,
  })) as any,
  wallets: [injected, walletLink, /* walletConnect, */ ledger, trezor],
  i18n: languageOverrides,
});

/* eslint-disable-next-line */
const metaMaskUnlocked = async () => {
  try {
    const accounts = await (window as any)?.ethereum?.request({ method: 'eth_accounts' });
    return accounts.length > 0;
  } catch (err:any) {
    return false;
  }
};

const connect = async (requestPermissions:boolean = true) => {
  const cachedWallet = localStorage.getItem('CACHED_WALLET_CONNECTION') || undefined;

  // Do not call request_permissions if user has never unlocked metamask
  const previousMetamaskConnection = await metaMaskUnlocked();

  // Brings up the web3 wallet select modal
  const [wallet] = await onboard.connectWallet(cachedWallet ? { autoSelect: { label: cachedWallet, disableModals: true } } : {});

  if (!wallet) throw new Error('Please select a wallet to continue');

  const { provider } = wallet;

  // Requests permissions (displays 'Select Accounts' popup)
  if (requestPermissions && previousMetamaskConnection) { // requestPermissions === false anywhere this function is called by a useEffect on load
    try {
      await provider.request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      } as any);
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

  localStorage.setItem('CACHED_WALLET_CONNECTION', wallet.label);

  return {
    provider,
    address,
    balance: parseInt((balance as any).toString(16), 16),
    chainId: parseInt((chainId as any).toString(16), 16),
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
  const [primaryWallet] = onboard.state.get().wallets;
  if (primaryWallet) await onboard.disconnectWallet({ label: primaryWallet.label });
  await deleteSession();
  window.localStorage.clear();
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
