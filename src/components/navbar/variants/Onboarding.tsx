import React from 'react';
import {
  Nav, Navbar, ListGroup, Row, Col,
} from 'react-bootstrap';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { XCircleFill } from 'react-bootstrap-icons';
import { walletState } from '../../../state/wallet';
import logo from '../../../images/navbar/mint_logo.png';
import banner from '../../../images/navbar/mint_banner.png';
import { connect, apiSession, disconnect } from '../../../utils/walletConnect';
import style from '../../../styles/navbar.module.css';
import { shortenAddress } from '../../../utils/helpers';
import networks from '../../../constants/networks';
import { errorState } from '../../../state/page';

const castNetworks = networks as any;

function OnboardingNavbar() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;
  const setErrorState = useSetRecoilState(errorState);

  return (
    <Row style={{ margin: '0px 4vw 0px 2vw' }}>
      <Col style={{ padding: '0px 0px 0px 0px' }}>
        <Navbar className={style['nav-container']} expand="lg">
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
              <p className={style['banner-text']} style={{ top: '42%', left: '55%' }}>
                MEMBER TOKEN MINT
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
                          setErrorState({ showError: false });

                          const {
                            address, balance, provider, chainId,
                          } = await connect();

                          const { memberToken } = await apiSession(provider, address);

                          setWalletState({
                            address, balance, provider, chainId, isConnected: true, isMember: true, memberToken,
                          });
                        } catch (error:any) {
                          setErrorState({ showError: true, content: error.message });
                        }
                      }}
                    >
                      MEMBERS CONNECT YOUR WALLET
                    </button>
                  </div>
                )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Col>
    </Row>
  );
}

export default OnboardingNavbar;
