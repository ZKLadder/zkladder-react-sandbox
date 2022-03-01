import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  Container, Button, Row, Col,
} from 'react-bootstrap';
import '../../styles/onboarding.css';
import P5Sketch from '../shared/P5Sketch';
import { onboardingState } from '../../state/onboarding';
import networks from '../../constants/networks';
import { walletState } from '../../state/wallet';

function Confirmation() {
  const { mintConfirmation, p5Sketch } = useRecoilValue(onboardingState);
  const wallet = useRecoilValue(walletState);

  const castNetworks = networks as any;

  return (
    <Container style={{ paddingLeft: '25px', paddingTop: '60px' }}>
      {/* Title */}
      <p className="title">
        CONFIRMATION: WELCOME TO ZK LADDER!
      </p>

      {/* Description */}
      <p className="description">
        You are now a part of the club.
        Below is your confirmation, you can see manage your NFT on your dashboard.
      </p>

      {/* P5 Canvas */}
      <div className="upload-wrapper">
        <P5Sketch
          config={{}}
          sketch={p5Sketch.sketch as any}
        />
      </div>

      {/* MemberNFT Description Fields */}
      <Row className="confirmation-wrapper" style={{ marginTop: '10px' }}>
        <Col className="confirmation-item" lg={12}>
          <span className="description">
            <b>MEMBER ADDRESS: </b>
            {mintConfirmation.userAddress}
          </span>
        </Col>

        <Col className="confirmation-item">
          <span className="description">
            <b>MEMBERSHIP TIER: </b>
            {mintConfirmation.membership}
          </span>
        </Col>

        <Col style={{ marginLeft: '10px', paddingRight: '0px' }} className="confirmation-item">
          <span className="description">
            <b>TOKEN ID: </b>
            {mintConfirmation.tokenId}
          </span>
        </Col>
        <Col className="confirmation-item" lg={12}>
          <span className="description">
            <b>ZKL NFT CONTRACT ADDRESS: </b>
            {mintConfirmation.contractAddress}
          </span>
        </Col>
        <Col className="confirmation-item" lg={12}>
          <span className="description">
            <b>TX HASH: </b>
            <a target="_blank" className="confirmation-link" href={`${castNetworks[wallet?.chainId as number]?.blockExplorer}${mintConfirmation.txHash}`} rel="noreferrer">{mintConfirmation.txHash}</a>
          </span>
        </Col>
      </Row>

      {/* Secondary Description */}
      <p className="description">
        This member token gives you access to the ZK Ladder platform to create and manage NFTs/FTs and engage with your community.
        You will also have access to a professional network that can assist you in setting up your DAO, project or NFT launches.
        Get started below.
      </p>

      {/* Go to Dashboard Button */}
      <Button
        style={{ marginBottom: '10px' }}
        className="active-button"
        onClick={async () => {
          window.location.reload();
        }}
      >
        GO TO MEMBER DASHBOARD
      </Button>
    </Container>
  );
}

export default Confirmation;
