import React from 'react';
import { useRecoilValue } from 'recoil';
import { Container, ListGroup } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';
import logo from '../../images/memberMint/logo_transparent.png';
import '../../styles/onboarding.css';
import SidebarStep from '../shared/SidebarStep';
import { onboardingState } from '../../state/onboarding';

function MemberMintSidebar() {
  const { currentStep } = useRecoilValue(onboardingState);
  return (
    <Container>
      <img
        alt=""
        src={logo}
        width="205"
        height="35"
      />
      {/* Title */}
      <p className="title">
        MINT YOUR ZKLADDER MEMBER NFT
      </p>

      {/* Description */}
      <p className="description">
        Welcome to the party!
        You are here because you received an invitation to the ZKL community and your ETH address has been whitelisted.
        Let’s get started:
      </p>

      {/* Steps list */}
      <ListGroup style={{ borderRadius: '10px' }}>
        <SidebarStep
          step={1}
          text="CONNECT YOUR WALLET"
          isActivated={currentStep === 1}
        />
        <SidebarStep
          step={2}
          text="UPLOAD TOKEN SEED"
          isActivated={currentStep === 2}
        />
        <SidebarStep
          step={3}
          text="PREVIEW AND MINT"
          isActivated={currentStep === 3}
        />
        <SidebarStep
          step={4}
          text="WELCOME TO ZKLADDER"
          isActivated={currentStep === 4}
        />

        {/* Help link */}
        <ListGroup.Item className="footer">
          <QuestionCircle size={20} style={{ marginRight: '5px' }} />
          <p style={{ display: 'inline' }}>
            Information incorrect? Having connection issues?
            {' '}
            <a target="_blank" href="https://www.zkladder.com/#join" rel="noreferrer">Get in touch here.</a>
          </p>
        </ListGroup.Item>
      </ListGroup>

    </Container>
  );
}

export default MemberMintSidebar;
