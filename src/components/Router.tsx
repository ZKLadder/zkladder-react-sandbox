import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Zkl from '@zkladder/zkladder-sdk-ts';
import Login from './login/Login';
import NavBar from './Navbar';
import Body from './Body';
import { walletState } from '../state/wallet';
import { getSession, deleteSession } from '../utils/api';
import { connect, apiSession } from '../utils/walletConnect';
import Loading from './shared/Loading';

let timeOutId:any;

function ZklRouter() {
  const [wallet, setWalletState] = useRecoilState(walletState);
  const [loadingState, setLoadingState] = useState(true);

  // Respond to user switching account outside of application
  const updateAccount = async (accounts:string[]) => {
    if (timeOutId) clearTimeout(timeOutId);
    timeOutId = setTimeout(async () => {
      try {
        await deleteSession();
        await apiSession(wallet.provider, accounts);
        setWalletState({ ...wallet, address: accounts });
      } catch (error) {
        setWalletState({
          isConnected: false,
          reason: 'Attempted to switch to an non-whitelisted account',
        });
      }
    }, 1000);
  };

  // Respond to user switching chainId outside of application
  const updateChainId = (chainId:number) => {
    setWalletState({ ...wallet, chainId: parseInt(chainId?.toString(16), 16) });
  };

  // Listen for changes in metamask outside of app
  if (wallet.isConnected) {
    wallet.provider.on('chainChanged', (chainId:number) => {
      if (chainId !== wallet.chainId) updateChainId(chainId);
    });
    wallet.provider.on('accountsChanged', (accounts:string[]) => {
      if (accounts.length < 1) setWalletState({ isConnected: false });
      if (accounts.length > 0 && accounts[0] !== wallet?.address?.[0]) updateAccount(accounts);
    });
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
        } = await connect();

        // @TODO Instantiate with a real projectID
        const zkLadder = new Zkl('12345', provider);
        setWalletState({
          address, balance, provider, chainId, zkLadder, isConnected: true,
        });
      }
      setLoadingState(false);
    };

    checkAuthStatus();
  }, []);

  // Loading spinner while app fetches auth
  if (loadingState) return (<Loading />);

  return (wallet.isConnected
    ? ( // Authenticated Route
      <Router>
        <Routes>
          <Route
            path="/"
            element={(
              <div>
                <NavBar />
                {/* @TODO Add Sidebar here */}
                <Body />
                {/* @TODO Add Modal element when switching accounts and awaiting signature */}
              </div>
              )}
          />
        </Routes>
      </Router>
    ) : ( // Unauthenticated Route
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />
        </Routes>
      </Router>
    )
  );
}

export default ZklRouter;
