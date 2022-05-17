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
import PageBody from './shared/PageBody';
import Navbar from './navbar/Navbar';
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

    // @TODO: See if there is a way to support account switching without destroying the session
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
    wallet.provider.on('disconnect', updateAccount);
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
      try {
        const { session, memberToken } = await getSession();
        const cachedProvider = localStorage.getItem('CACHED_WALLET_CONNECTION');
        if (session && cachedProvider) {
          const {
            address, balance, provider, chainId,
          } = await connect(false);

          setWalletState({
            address, balance, provider, chainId, isConnected: true, isMember: true, memberToken,
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
      } catch (err) {
        // do nothing
      }
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
                <PageBody color={{ start: '#16434B', end: '#4EB9B1' }}>
                  <Navbar variant="authenticated" />
                  <Body />
                </PageBody>
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
