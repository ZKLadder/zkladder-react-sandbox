import React from 'react';
import {
  Nav, Navbar, Container, Button, ListGroup,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { walletState } from '../state/wallet';
import logo from '../images/zk_favicon.png';
import style from '../styles/navbar';
import { disconnect } from '../utils/walletConnect';
import { shortenAddress, weiToEth } from '../utils/address';
import networks from '../constants/networks';

const castNetworks = networks as any;

function ZKLNavbar() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;

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
          <Nav className="ml-auto">
            <ListGroup.Item style={style.spanText}>{`${castNetworks[wallet.chainId]?.name as string} : ${shortenAddress(wallet.address?.[0])}`}</ListGroup.Item>
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
        </Navbar.Collapse>
      </Container>

    </Navbar>
  );
}

export default ZKLNavbar;
