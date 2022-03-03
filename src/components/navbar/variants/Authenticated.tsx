import React, { } from 'react';
import {
  Nav, Navbar, ListGroup, Container,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { XCircleFill } from 'react-bootstrap-icons';
import { walletState } from '../../../state/wallet';
import logo from '../../../images/navbar/mint_logo.png';
import banner from '../../../images/navbar/dashboard_banner.png';
import zkFav from '../../../images/navbar/dashboard_logo.png';
import { disconnect } from '../../../utils/walletConnect';
import '../../../styles/navbar.css';
import { shortenAddress, weiToEth } from '../../../utils/address';
import networks from '../../../constants/networks';

const castNetworks = networks as any;

function AuthenticatedNavbar() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;

  return (
    <Navbar className="member-mint" expand="lg">
      <Container>
        <Navbar.Brand>

          {/* ZKL Logo */}
          <img
            className="logo"
            alt=""
            src={logo}
            width="50"
            height="50"
          />

          {/* Member Dashboard Banner */}
          <div style={{ display: 'inline', position: 'relative' }}>
            <img
              className="logo"
              alt=""
              src={banner}
              width="240"
              height="50"
            />
            <p className="banner-text">
              ZKL MEMBER DASHBOARD
            </p>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle className="ml-auto" aria-controls="basic-navbar-nav" />

        {/* Collapsible Section */}
        <Navbar.Collapse>
          <Nav className="ml-auto">

            {/* Balance and Currency Section */}
            <ListGroup.Item className="dashboard-nav-balance">
              <img
                className="dashboard-nav-logo"
                alt="zk-logo"
                src={zkFav}
              />
              <span className="dashboard-nav-text">{`${weiToEth(wallet.balance)} ${castNetworks[wallet.chainId]?.token}`}</span>
            </ListGroup.Item>

            {/* Connected Network and Address Section */}
            <ListGroup.Item className="connected-labels">
              {`${castNetworks[wallet.chainId]?.label as string} : ${shortenAddress(wallet.address?.[0])}`}
              <XCircleFill
                data-testid="disconnectButton"
                className="icon"
                size={16}
                onClick={async () => {
                  await disconnect();
                  setWalletState({ isConnected: false, isMember: false });
                }}
              />
            </ListGroup.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AuthenticatedNavbar;
