import React, { useState } from 'react';
import {
  Nav, Navbar, Container, ListGroup,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { XCircleFill } from 'react-bootstrap-icons';
import { walletState } from '../../../state/wallet';
import logo from '../../../images/navbar/mint_logo.png';
import banner from '../../../images/navbar/mint_banner.png';
import { connect, apiSession, disconnect } from '../../../utils/walletConnect';
import Error from '../../shared/Error';
import style from '../../../styles/navbar.module.css';
import { shortenAddress } from '../../../utils/helpers';
import networks from '../../../constants/networks';

const castNetworks = networks as any;

function OnboardingNavbar() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;
  const [errorState, setErrorState] = useState() as any;

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

          {/* Member Mint Banner */}
          <div style={{ display: 'inline', position: 'relative' }}>
            <img
              className={style.logo}
              alt=""
              src={banner}
              width="240"
              height="50"
            />
            <p className={style['banner-text']}>
              ZKL MEMBER TOKEN MINT
            </p>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle className="ml-auto" aria-controls="basic-navbar-nav" />

        {/* Collapsible Section */}
        <Navbar.Collapse>
          <Nav className="ml-auto">
            {wallet.isConnected
              ? (/* Connected Network & Address */
                <div style={{ display: 'inline' }}>
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

                </div>
              )
              : (/* Connect Button */
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
              )}
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

export default OnboardingNavbar;
