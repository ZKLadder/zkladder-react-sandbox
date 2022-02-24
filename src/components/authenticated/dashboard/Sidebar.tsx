import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import { MemberNft } from '@zkladder/zkladder-sdk-ts';
import { useRecoilValue } from 'recoil';
import {
  Gear, Discord, Twitter, Linkedin, Telegram,
} from 'react-bootstrap-icons';
import config from '../../../config';
import { walletState } from '../../../state/wallet';
import P5Sketch from '../../shared/P5Sketch';
import Loading from '../../shared/Loading';
import { shortenAddress } from '../../../utils/address';
import logo from '../../../images/dashboard/dashboard-logo.png';

function DashboardSidebar() {
  const { provider, address } = useRecoilValue(walletState);
  const [memberToken, setMemberToken] = useState({}) as [{attestationHash:string}, Dispatch<SetStateAction<{}>>];
  const [p5Sketch, setP5Sketch] = useState();

  useEffect(() => {
    async function getMemberToken() {
      const zklMemberNft = await MemberNft.setup({
        provider,
        address: config.zkl.memberNft,
        infuraIpfsProjectId: config.ipfs.projectId,
        infuraIpfsProjectSecret: config.ipfs.projectSecret,
      });

      const token = (await zklMemberNft.getAllTokensOwnedBy(address?.[0] as string))[0];
      setMemberToken({
        tokenId: token.tokenId,
        attestationHash: token.metadata?.attestation_hash,
        owner: token.owner,
      });
    }
    getMemberToken();
  }, []);

  useEffect(() => {
    async function getZKLSketch() {
      if (memberToken.attestationHash) {
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
        <div style={{ position: 'relative' }}>
          <P5Sketch
            config={{ attestationHash: memberToken.attestationHash }}
            sketch={(p5Sketch as any).sketch}
          />

          <span className="member-graphic-text-top">
            {`NFT Holder: ${shortenAddress(address?.[0] as string)}`}
          </span>

          <span className="member-graphic-text-bottom">
            <img src={logo} alt="zklogo" style={{ marginBottom: '4px', marginRight: '5px' }} />
            <span style={{ verticalAlign: 'bottom' }}>MEMBER</span>
          </span>
        </div>

        <Row style={{ maxWidth: '400px', padding: '0px', margin: '0px' }}>
          <Col style={{ padding: '5px' }} xs={6}>
            <div className="dashboard-metric">
              <p className="dashboard-metric-title">MY PROJECTS</p>
              <p className="dashboard-metric-figure">0</p>
            </div>
          </Col>
          <Col style={{ padding: '5px' }} xs={6}>
            <div className="dashboard-metric">
              <p className="dashboard-metric-title">TOTAL PROJECTS</p>
              <p className="dashboard-metric-figure">1</p>
            </div>
          </Col>
        </Row>
        <Row style={{ maxWidth: '400px', padding: '0px', margin: '0px' }}>
          <Col style={{ padding: '5px' }} xs={6}>
            <div className="dashboard-metric">
              <p className="dashboard-metric-title">ZKL MEMBERS</p>
              <p className="dashboard-metric-figure">3</p>
            </div>
          </Col>
          <Col style={{ padding: '5px' }} xs={6}>
            <div style={{ marginLeft: '0px' }} className="dashboard-metric">
              <p className="dashboard-metric-title">ASSETS IN TREASURY </p>
              <p className="dashboard-metric-figure">$0</p>
            </div>
          </Col>
        </Row>
        <Row style={{
          maxWidth: '400px', padding: '0px', margin: '0px', marginTop: '40px',
        }}
        >
          <Col style={{ padding: '5px' }} xs={12}>
            <div className="dashboard-settings-bar">
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
            <div className="dashboard-social-icon">
              <Discord size={36} />
            </div>
          </Col>
          <Col style={{ padding: '0px' }} xs={3}>
            <div className="dashboard-social-icon">
              <Twitter size={36} />
            </div>
          </Col>
          <Col style={{ padding: '0px' }} xs={3}>
            <div className="dashboard-social-icon">
              <Linkedin size={36} />
            </div>
          </Col>
          <Col style={{ padding: '0px' }} xs={3}>
            <div className="dashboard-social-icon">
              <Telegram size={36} />
            </div>
          </Col>
        </Row>
      </Container>
    )
    : <Loading />;
}

export default DashboardSidebar;
