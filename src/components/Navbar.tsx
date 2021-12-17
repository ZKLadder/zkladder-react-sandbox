import React, { useEffect } from 'react';
import {
  Nav, Navbar, Container, Button, ListGroup,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { walletState } from '../state/wallet';
import logo from '../images/zk_favicon.png';
import style from '../styles/Navbar';
import { connect, disconnect } from '../utils/walletConnect';
import { shortenAddress, weiToEth } from '../utils/address';
import networks from '../constants/networks';

const castNetworks = networks as any;

function ZKLNavbar() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;

  if (wallet.isConnected) {
    wallet.provider.on('chainChanged', (chainId:number) => {
      if (chainId !== wallet.chainId) setWalletState({ ...wallet, chainId: parseInt(chainId?.toString(16), 16) });
    });
    wallet.provider.on('accountsChanged', (accounts:string[]) => {
      if (accounts[0] !== wallet.address[0]) setWalletState({ ...wallet, address: accounts });
    });
  }

  const updateWalletData: any = async () => {
    if (wallet.isConnected) {
      let balance = await wallet.provider.request(
        {
          method: 'eth_getBalance',
          params: [wallet.address?.[0], 'latest'],
        },
      );
      balance = parseInt(balance?.toString(16), 16);
      const chainId = await wallet.provider.request({ method: 'eth_chainId' });
      setWalletState({
        ...wallet,
        balance,
        chainId: parseInt(chainId?.toString(16), 16),
      });
    }
  };

  useEffect(updateWalletData, [wallet.chainId, wallet.address]);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <img
            alt=""
            style={style.logo}
            src={logo}
            width="40"
            height="40"
          />
          ZKLadder
        </Navbar.Brand>

        <Navbar.Toggle className="ml-auto" aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {!wallet.isConnected
            ? (
              <Nav className="ml-auto">
                <Button
                  data-testid="connectButton"
                  onClick={async () => {
                    const {
                      address, balance, provider, chainId,
                    } = await connect();
                    setWalletState({
                      address, balance, provider, chainId, isConnected: true,
                    });
                  }}
                  variant="outline-success"
                >
                  Connect Wallet

                </Button>
              </Nav>
            )
            : (
              <Nav className="ml-auto">
                <ListGroup.Item style={style.spanText}>{`${castNetworks[wallet.chainId]?.name as string} : ${shortenAddress(wallet.address[0])}`}</ListGroup.Item>
                <ListGroup.Item style={style.spanText}>{`${weiToEth(wallet.balance)} ETH`}</ListGroup.Item>
                <Button
                  data-testid="disconnectButton"
                  onClick={async () => {
                    await disconnect();
                    setWalletState({ isConnected: false });
                  }}
                  variant="outline-danger"
                >
                  Disconnect Wallet

                </Button>
              </Nav>
            )}

        </Navbar.Collapse>
      </Container>

    </Navbar>
  );
}

export default ZKLNavbar;
