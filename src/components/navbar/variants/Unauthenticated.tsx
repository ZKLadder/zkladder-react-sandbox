import React, { useState } from 'react';
import {
  Nav, Navbar, Container,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import Error from '../../shared/Error';
import { walletState } from '../../../state/wallet';
import logo from '../../../images/navbar/mint_logo.png';
import banner from '../../../images/navbar/dashboard_banner.png';
import { connect, apiSession } from '../../../utils/walletConnect';
import style from '../../../styles/navbar.module.css';

function UnauthenticatedNavbar() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;
  const [errorState, setErrorState] = useState(false) as any;

  return (
    <Navbar className={style['member-mint']} expand="lg">
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
          {/* Member Mint Banner */}
          <div style={{ display: 'inline', position: 'relative' }}>
            <img
              className={style.logo}
              alt=""
              src={banner}
              width="240"
              height="50"
            />
            {/*   */}
            <p className={style['banner-text']}>
              ZKL COMMUNITY DASHBOARD
            </p>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle className="ml-auto" aria-controls="basic-navbar-nav" />

        <Navbar.Collapse>
          <Nav className="ml-auto">
            {/* Connect Button */}
            <div style={{ display: 'inline', position: 'relative' }}>
              <button
                className={style.connect}
                type="button"
                data-testid="connectButton"
                onClick={async () => {
                  try {
                    setErrorState(false);

                    const {
                      address, balance, provider, chainId,
                    } = await connect();

                    const { memberToken } = await apiSession(provider, address);

                    setWalletState({
                      address, balance, provider, chainId, isConnected: true, isMember: true, memberToken,
                    });
                  } catch (error:any) {
                    setErrorState(error.message);
                  }
                }}
              >
                MEMBERS CONNECT YOUR WALLET
              </button>
            </div>
          </Nav>
          {/* Error Indicator */}
          <div style={{ paddingLeft: '10px' }}>
            {(errorState || wallet.reason) ? <Error text={errorState || wallet.reason || 'It appears your account does not have access'} /> : null}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UnauthenticatedNavbar;
