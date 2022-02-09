import React, { useState } from 'react';
import {
  Nav, Navbar, Container, ListGroup,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { XCircleFill } from 'react-bootstrap-icons';
import { walletState } from '../../../state/wallet';
import logo from '../../../images/navbar/mint_logo.png';
import banner from '../../../images/navbar/mint_banner.png';
import connectImage from '../../../images/navbar/mint_connect.png';
import { connect, apiSession, disconnect } from '../../../utils/walletConnect';
import Error from '../../shared/Error';
import '../../../styles/navbar.css';
import { shortenAddress } from '../../../utils/address';
import networks from '../../../constants/networks';

const castNetworks = networks as any;

function MemberMintNavbar() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;
  const [errorState, setErrorState] = useState() as any;

  return (
    <Navbar className="member-mint" variant="dark" bg="light" expand="lg">
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

          {/* Member Mint Banner */}
          <div style={{ display: 'inline', position: 'relative' }}>
            <img
              className="logo"
              alt=""
              src={banner}
              width="240"
              height="50"
            />
            <p className="banner-text">
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
                  <ListGroup.Item className="connected-labels">
                    {`${castNetworks[wallet.chainId]?.name as string} : ${shortenAddress(wallet.address?.[0])}`}
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

                </div>
              )
              : (/* Connect Button */
                <div style={{ display: 'inline', position: 'relative' }}>
                  <button
                    className="connect"
                    type="button"
                    data-testid="connectButton"
                    onClick={async () => {
                      try {
                        setErrorState(false);

                        const {
                          address, balance, provider, chainId,
                        } = await connect();

                        await apiSession(provider, address);

                        setWalletState({
                          address, balance, provider, chainId, isConnected: true, isMember: true,
                        });
                      } catch (error:any) {
                        setErrorState(error.message);
                      }
                    }}
                  >
                    <img
                      className="connect-image"
                      alt=""
                      src={connectImage}
                      width="260"
                      height="80"
                    />
                    <p className="connect-text">
                      MEMBERS CONNECT YOUR WALLET
                    </p>
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

export default MemberMintNavbar;
