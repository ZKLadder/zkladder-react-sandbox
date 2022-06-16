import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  Container, ListGroup, Row, Col,
} from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';
import logo from '../../images/memberMint/logo_transparent.png';
import style from '../../styles/onboarding.module.css';
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
        style={{ marginTop: '5px' }}
      />
      {/* Title */}
      <p className={style.title}>
        MINT YOUR ZKLADDER MEMBER NFT
      </p>

      {/* Description */}
      <p className={style.description}>
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

        <div className={style['footer-wrapper']}>
          <hr style={{ margin: '0px 0px 8px 0px' }} />

          {/* Support link */}
          <ListGroup.Item className={style.footer}>
            <Row>
              <Col style={{ padding: '5px 0px 0px 0px' }} xs={1}>
                <QuestionCircle size={20} style={{ alignSelf: 'center' }} />
              </Col>
              <Col style={{ marginLeft: '1px' }}>
                <p style={{ display: 'inline' }}>
                  Having issues? Questions?
                  {' '}
                  <a target="_blank" href="https://www.zkladder.com/#join" rel="noreferrer">Get in touch here.</a>
                </p>
              </Col>
            </Row>
          </ListGroup.Item>
          <hr style={{ margin: '8px 0px 0px 0px' }} />
        </div>
      </ListGroup>

    </Container>
  );
}

export default MemberMintSidebar;
