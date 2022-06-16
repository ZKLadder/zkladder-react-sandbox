import React, { } from 'react';
import {
  Nav, Navbar, ListGroup, Row, Col,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { XCircleFill } from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';
import { walletState } from '../../../state/wallet';
import logo from '../../../images/navbar/mint_logo.png';
import dashboardIcon from '../../../images/navbar/dashboard.png';
import creatorsIcon from '../../../images/navbar/creator_tools.png';
import zkFav from '../../../images/navbar/dashboard_logo.png';
import { disconnect } from '../../../utils/walletConnect';
import style from '../../../styles/navbar.module.css';
import { shortenAddress, weiToEth } from '../../../utils/helpers';
import networks from '../../../constants/networks';

const castNetworks = networks as any;

function AuthenticatedNavbar() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;
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
        </Navbar>
      </Col>
    </Row>
  );
}

export default AuthenticatedNavbar;
