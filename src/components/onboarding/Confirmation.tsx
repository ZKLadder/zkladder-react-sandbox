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
      <p className="title">
        CONFIRMATION: WELCOME TO ZK LADDER!
      </p>
      <p className="description">
        You are now a part of the club.
        Below is your confirmation, you can see manage your NFT on your dashboard.
      </p>

      <div className="upload-wrapper">
        <P5Sketch
          config={{}}
          sketch={p5Sketch.sketch as any}
        />

      </div>
      <Row className="confirmation-wrapper" style={{ marginTop: '10px' }}>
        <Col className="confirmation-item" lg={12}>
          <span className="description">
            <b>MEMBER ADDRESS: </b>
            {mintConfirmation.userAddress}
          </span>
        </Col>
        <Col className="confirmation-item" lg={6}>
          <span className="description">
            <b>MEMBERSHIP TIER: </b>
            {mintConfirmation.membership}
          </span>
        </Col>
        <Col style={{ display: 'inline' }} className="confirmation-item" lg={5}>
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
      <p className="description">
        This member token gives you access to the ZK Ladder platform to create and manage NFTs/FTs and engage with your community.
        You will also have access to a professional network that can assist you in setting up your DAO, project or NFT launches.
        Get started below.
      </p>

      <Button
        style={{ marginBottom: '10px' }}
        className="active-button"
        onClick={async () => {
          // @TODO SET ROUTE
        }}
      >
        GO TO MEMBER DASHBOARD
      </Button>
    </Container>
  );
}

export default Confirmation;
