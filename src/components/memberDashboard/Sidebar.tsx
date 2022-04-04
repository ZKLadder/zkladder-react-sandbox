import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import {
  Gear, Discord, Twitter, Linkedin, Telegram,
} from 'react-bootstrap-icons';
import config from '../../config';
import { walletState } from '../../state/wallet';
import P5Sketch from '../shared/P5Sketch';
import Loading from '../shared/Loading';
import { shortenAddress } from '../../utils/helpers';
import logo from '../../images/dashboard/dashboard-logo.png';
import style from '../../styles/memberDashboard.module.css';

function DashboardSidebar() {
  const { address, memberToken } = useRecoilValue(walletState);
  const [p5Sketch, setP5Sketch] = useState();

  useEffect(() => {
    async function getZKLSketch() {
      if (memberToken?.metadata.tokenSeed) {
        const response = await fetch(config.zkl.memberSketchCid);
        const memberSketch = await response.text();
        /* eslint-disable no-new-func */
        const parsedMemberSketch = Function(memberSketch);
        setP5Sketch(parsedMemberSketch());
      }
    }
    getZKLSketch();
  }, [memberToken]);

  return p5Sketch
    ? (
      <Container>
        <div id="memberDash" className={style['art-wrapper']}>
          <P5Sketch
            className={style.p5Sketch}
            config={{ tokenSeed: memberToken?.metadata.tokenSeed }}
            sketch={(p5Sketch as any).sketch}
          />

          <span className={style['member-graphic-text-top']}>
            {`NFT Holder: ${shortenAddress(address?.[0] as string)}`}
          </span>

          <span className={style['member-graphic-text-bottom']}>
            <img src={logo} alt="zklogo" style={{ marginBottom: '4px', marginRight: '5px' }} />
            <span style={{ verticalAlign: 'bottom' }}>{`MEMBER #${memberToken?.tokenId}`}</span>
          </span>
        </div>

        <Row style={{ maxWidth: '400px', padding: '0px', margin: '0px' }}>
          <Col style={{ padding: '5px' }} xs={6}>
            <div className={style['dashboard-metric']}>
              <p className={style['dashboard-metric-title']}>MY PROJECTS</p>
              <p className={style['dashboard-metric-figure']}>0</p>
            </div>
          </Col>
          <Col style={{ padding: '5px' }} xs={6}>
            <div className={style['dashboard-metric']}>
              <p className={style['dashboard-metric-title']}>TOTAL PROJECTS</p>
              <p className={style['dashboard-metric-figure']}>1</p>
            </div>
          </Col>
        </Row>
        <Row style={{ maxWidth: '400px', padding: '0px', margin: '0px' }}>
          <Col style={{ padding: '5px' }} xs={6}>
            <div className={style['dashboard-metric']}>
              <p className={style['dashboard-metric-title']}>ZKL MEMBERS</p>
              <p data-testid="memberCount" className={style['dashboard-metric-figure']}>{memberToken?.totalSupply}</p>
            </div>
          </Col>
          <Col style={{ padding: '5px' }} xs={6}>
            <div style={{ marginLeft: '0px' }} className={style['dashboard-metric']}>
              <p className={style['dashboard-metric-title']}>ASSETS IN TREASURY </p>
              <p className={style['dashboard-metric-figure']}>$0</p>
            </div>
          </Col>
        </Row>
        <Row style={{
          maxWidth: '400px', padding: '0px', margin: '0px', marginTop: '40px',
        }}
        >
          <Col style={{ padding: '5px' }} xs={12}>
            <div className={style['dashboard-settings-bar']}>
              <Gear size={24} />
              <span style={{ verticalAlign: 'middle', marginLeft: '15px' }}>ZKL Member Profile Settings</span>
            </div>
          </Col>
        </Row>
        <Row style={{
          maxWidth: '400px', padding: '0px', margin: '0px', marginTop: '5px', textAlign: 'center',
        }}
        >
          <Col style={{ padding: '0px' }} xs={3}>
            <div className={style['dashboard-social-icon']}>
              <Discord size={36} />
            </div>
          </Col>
          <Col style={{ padding: '0px' }} xs={3}>
            <div className={style['dashboard-social-icon']}>
              <Twitter size={36} />
            </div>
          </Col>
          <Col style={{ padding: '0px' }} xs={3}>
            <div className={style['dashboard-social-icon']}>
              <Linkedin size={36} />
            </div>
          </Col>
          <Col style={{ padding: '0px' }} xs={3}>
            <div className={style['dashboard-social-icon']}>
              <Telegram size={36} />
            </div>
          </Col>
        </Row>
      </Container>
    )
    : <Loading />;
}

export default DashboardSidebar;
