import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useRecoilValue, useRecoilState } from 'recoil';
import PageBody from '../shared/PageBody';
import Navbar from '../navbar/Navbar';
import style from '../../styles/onboarding.module.css';
import { onboardingState } from '../../state/onboarding';
import MemberMintSidebar from './Sidebar';
import ConnectWallet from './ConnectWallet';
import Attestation from './Attestation';
import Mint from './Mint';
import Confirmation from './Confirmation';
import { walletState } from '../../state/wallet';

function Onboarding() {
  const [onboarding, setOnboardingState] = useRecoilState(onboardingState);
  const { isConnected, isMember, chainId } = useRecoilValue(walletState);

  // If user disconnects at any point - push back to first step
  useEffect(() => {
    if (isConnected === false || chainId !== 137) {
      setOnboardingState({ currentStep: 1 } as any);
    }
  }, [isConnected, isMember, chainId]);

  return (
    <PageBody color={{ start: '#16434B', end: '#4EB9B1' }}>
      <Navbar variant="onboarding" />
      <Row className={style['content-wrapper']}>
        <Col className={`${style.sidebar} d-none d-lg-block`} lg={3}>
          <MemberMintSidebar />
        </Col>
        <Col>
          {onboarding.currentStep === 1 ? <ConnectWallet /> : null}
          {onboarding.currentStep === 2 ? <Attestation /> : null}
          {onboarding.currentStep === 3 ? <Mint /> : null}
          {onboarding.currentStep === 4 ? <Confirmation /> : null}
        </Col>
      </Row>
    </PageBody>

  );
}

export default Onboarding;
