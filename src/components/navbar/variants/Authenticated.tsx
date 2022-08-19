import React, { useState } from 'react';
import {
  Nav, Navbar, ListGroup, Row, Col, Dropdown,
} from 'react-bootstrap';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  Boxes, CaretDownFill, Clipboard, ClipboardCheck, XCircle,
} from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';
import { walletState } from '../../../state/wallet';
import logo from '../../../images/navbar/mint_logo.png';
import dashboardIcon from '../../../images/navbar/dashboard.png';
import creatorsIcon from '../../../images/navbar/creator_tools.png';
import zkFav from '../../../images/navbar/dashboard_logo.png';
import { disconnect, switchChain } from '../../../utils/walletConnect';
import style from '../../../styles/navbar.module.css';
import { shortenAddress, weiToEth } from '../../../utils/helpers';
import networks from '../../../constants/networks';
import Popover from '../../shared/Popover';
import { loadingState } from '../../../state/page';

const castNetworks = networks as any;

function AuthenticatedNavbar() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;
  const setLoading = useSetRecoilState(loadingState);

  const [addressCopied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(wallet.address[0]);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const { '*': page } = useParams();

  return (
    <Row style={{ margin: '0px 4vw 0px 2vw' }}>
      <Col style={{ padding: '0px' }}>
        <Navbar className={style['nav-container']} expand="lg">
          {/* ZKL Logo */}
          <img
            className={style.logo}
            alt=""
            src={logo}
            width="50"
            height="50"
          />
          <Navbar.Toggle className="ml-auto" aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Navbar.Brand>
              <ListGroup horizontal="lg">

                {/* Member Dashboard Banner */}
                <ListGroup.Item
                  style={{ marginRight: '10px' }}
                  className={page === 'dashboard' ? style.banner : style['banner-inactive']}
                >
                  <Link to="/dashboard">
                    <img
                      style={{ margin: '0px 15px 25px 5px' }}
                      className={style.logo}
                      alt=""
                      src={dashboardIcon}
                    />
                    <span className={style['banner-text']}>
                      MEMBER DASHBOARD
                    </span>
                  </Link>
                </ListGroup.Item>

                {/* Creator Tools Banner */}
                <ListGroup.Item className={page?.includes('projects') || page === 'deploy' ? style.banner : style['banner-inactive']}>
                  <Link to="/projects">
                    <img
                      style={{ margin: '0px 15px 25px 5px' }}
                      className={style.logo}
                      alt=""
                      src={creatorsIcon}
                    />
                    <span className={style['banner-text']}>
                      CREATOR TOOLS
                    </span>
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Navbar.Brand>

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
              <Popover
                header={(
                  <ListGroup.Item data-testid="header" className={`text-center ${style['connected-labels']}`}>
                    {`${castNetworks[wallet.chainId]?.label as string} : ${shortenAddress(wallet.address?.[0])}`}
                    <CaretDownFill
                      data-testid="disconnectButton"
                      className={style.icon}
                      size={16}
                    />
                  </ListGroup.Item>
                )}
              >
                <div className={style.popover}>
                  <span style={{ margin: '0px 20px 0px 20px' }}>WALLET SETTINGS</span>
                  <hr style={{ backgroundColor: 'white', margin: '10px 0px 10px 0px' }} />
                  <span
                    role="button"
                    tabIndex={0}
                    className={style['popover-option']}
                    onClick={copy}
                  >
                    {addressCopied ? (
                      <ClipboardCheck
                        style={{ margin: '0px 10px 4px 0px' }}
                        size={16}
                      />
                    )
                      : (
                        <Clipboard
                          style={{ margin: '0px 10px 4px 0px' }}
                          size={16}
                        />
                      )}

                    Copy Wallet Address
                  </span>

                  <span
                    className={style['popover-option']}
                    style={{ paddingRight: '0px !important' }}
                  >
                    <Boxes
                      style={{ margin: '0px 10px 4px 0px' }}
                      onClick={() => {}}
                      size={16}
                    />
                    <Dropdown style={{ display: 'inline' }}>
                      <Dropdown.Toggle
                        style={{
                          textAlign: 'left', backgroundColor: 'transparent', color: 'white', fontWeight: 'bold', minWidth: '80%',
                        }}
                        variant="light"
                        className={style['form-dropdown']}
                        data-testid="dropdown"
                      >
                        {castNetworks?.[wallet.chainId]?.label}
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        align="end"
                        style={{
                          marginTop: '10px', padding: '1px', minWidth: '100%', backgroundColor: '#3C9891',
                        }}
                        className={style['form-dropdown']}
                      >
                        {Object.values(castNetworks).map((network: any, index: any) => (
                          <Dropdown.Item
                            className={style['chain-select']}
                            key={network.label}
                            data-testid={network.label}
                            onClick={async () => {
                              try {
                                setLoading({ loading: true, header: `Switching to ${network.label} network`, content: 'Awaiting wallet approval' });
                                await switchChain(Object.keys(castNetworks)[index]);
                                setLoading({ loading: false });
                              } catch (err:any) {
                                setLoading({ loading: false });
                              }
                            }}
                          >
                            {network.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={async () => {
                      await disconnect();
                      setWalletState({ isConnected: false, isMember: false });
                    }}
                    className={style['popover-option']}
                  >
                    <XCircle
                      style={{ margin: '0px 10px 4px 0px' }}
                      size={16}
                    />
                    Disconnect Wallet
                  </span>
                </div>
              </Popover>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Col>
    </Row>
  );
}

export default AuthenticatedNavbar;
