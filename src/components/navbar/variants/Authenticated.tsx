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
import style from '../../../styles/navbar.module.css';
import { shortenAddress, weiToEth } from '../../../utils/helpers';
import networks from '../../../constants/networks';

const castNetworks = networks as any;

function AuthenticatedNavbar() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;

  return (
    <Navbar className={style['nav-container']} expand="lg">
      <Container>
        <Navbar.Brand>

          {/* ZKL Logo */}
          <img
            className={style.logo}
            alt=""
            src={logo}
            width="50"
            height="50"
          />

          {/* Member Dashboard Banner */}
          <div style={{ display: 'inline', position: 'relative' }}>
            <img
              className={style.logo}
              alt=""
              src={banner}
              width="240"
              height="50"
            />
            <p className={style['banner-text']}>
              ZKL MEMBER DASHBOARD
            </p>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle className="ml-auto" aria-controls="basic-navbar-nav" />

        {/* Collapsible Section */}
        <Navbar.Collapse>
          <Nav className="ml-auto">

            {/* Balance and Currency Section */}
            <ListGroup.Item className={style['dashboard-nav-balance']}>
              <img
                className={style['dashboard-nav-logo']}
                alt="zk-logo"
                src={zkFav}
              />
              <span className={style['dashboard-nav-text']}>{`${weiToEth(wallet.balance)} ${castNetworks[wallet.chainId]?.token}`}</span>
            </ListGroup.Item>

            {/* Connected Network and Address Section */}
            <ListGroup.Item className={style['connected-labels']}>
              {`${castNetworks[wallet.chainId]?.label as string} : ${shortenAddress(wallet.address?.[0])}`}
              <XCircleFill
                data-testid="disconnectButton"
                className={style.icon}
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
