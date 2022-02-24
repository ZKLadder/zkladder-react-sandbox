/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Login from './login/Login';
import Body from './Body';
import { walletState } from '../state/wallet';
import { getSession } from '../utils/api';
import { connect, disconnect } from '../utils/walletConnect';
import Loading from './shared/Loading';
import Onboarding from './onboarding/Onboarding';

let timeOutId:any;

function ZklRouter() {
  const [wallet, setWalletState] = useRecoilState(walletState);
  const [loadingState, setLoadingState] = useState(true);

  // Respond to user switching account outside of application
  const updateAccount = async (accounts:string[]) => {
    await disconnect();

    // Commenting out due to issues switching from a Member Account to a Non-Member Account from the crypto wallet
    // @TODO: See if there is a way to support account switching without destroying the session
    /*
    setWalletState({
      isConnected: false,
      isMember: false,
      reason: 'We detected an account switch occur in your wallet. Please log in again with your new account',
    });

     if (accounts.length < 1) {
      await disconnect();
      setWalletState({ isConnected: false, isMember: false });
    }

    if (accounts.length > 0 && accounts[0] !== wallet?.address?.[0]) {
      if (timeOutId) clearTimeout(timeOutId);
      timeOutId = setTimeout(async () => {
        try {
          await deleteSession();
          await apiSession(wallet.provider, accounts);
          setWalletState({ ...wallet, address: accounts });
        } catch (error) {
          setWalletState({
            isConnected: false,
            isMember: false,
            reason: 'Attempted to switch to an non-whitelisted account',
          });
        }
      }, 1000);
    } */
  };

  // Respond to user switching chainId outside of application
  const updateChainId = (chainId:number) => {
    if (chainId !== wallet.chainId) {
      if (timeOutId) clearTimeout(timeOutId);
      timeOutId = setTimeout(async () => {
        setWalletState({ ...wallet, chainId: parseInt(chainId?.toString(16), 16) });
      }, 200);
    }
  };

  // Listen for changes in metamask outside of app
  if (wallet.isConnected) {
    wallet.provider.on('chainChanged', updateChainId);
    wallet.provider.on('accountsChanged', updateAccount);
  }

  // Update wallet balance in response to account or chainId changing
  const updateBalance: any = async () => {
    if (wallet.isConnected) {
      let balance = await wallet.provider.request(
        {
          method: 'eth_getBalance',
          params: [wallet.address?.[0], 'latest'],
        },
      );

      balance = parseInt(balance?.toString(16), 16);
      setWalletState({
        ...wallet,
        balance,
      });
    }
  };

  useEffect(updateBalance, [wallet.chainId, wallet.address]);

  // Check if user is already logged in on initial page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { session } = await getSession();
      const cachedProvider = localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER');
      if (session && cachedProvider) {
        const {
          address, balance, provider, chainId,
        } = await connect(false);

        setWalletState({
          address, balance, provider, chainId, isConnected: true, isMember: true,
        });
      }

      if (cachedProvider && !session) {
        const {
          address, balance, provider, chainId,
        } = await connect(false);
        setWalletState({
          address, balance, provider, chainId, isConnected: true, isMember: false,
        });
      }
      setLoadingState(false);
    };

    checkAuthStatus();
  }, []);

  // Loading spinner while app fetches auth
  if (loadingState) return (<Loading />);

  // Authenticated Routes
  if (wallet.isConnected && wallet.isMember) {
    return (
      <Router>
        <Routes>
          <Route
            path="/*"
            element={(
              <div>
                {/* @TODO Add Sidebar here */}
                <Body />
                {/* @TODO Add Modal element when switching accounts and awaiting signature */}
              </div>
              )}
          />
        </Routes>
      </Router>
    );
  }

  // Public Routes
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/mint"
          element={<Onboarding />}
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default ZklRouter;
