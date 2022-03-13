import React from 'react';
import { useRecoilValue } from 'recoil';
import { Container, ListGroup } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';
import logo from '../../images/memberMint/logo_transparent.png';
import style from '../../styles/deploy.module.css';
import SidebarStep from '../shared/SidebarStep';
import { deployState } from '../../state/deploy';

function MemberMintSidebar() {
  const { currentStep } = useRecoilValue(deployState);
  return (
    <Container>
      <img
        alt=""
        src={logo}
        width="205"
        height="35"
      />
      {/* Title */}
      <p className={style.title}>
        SET UP A NEW WEB3 PROJECT
      </p>

      {/* Description */}
      <p className={style.description}>
        Fill out the steps to the right and lets get your project deployed
      </p>

      {/* Steps list */}
      <ListGroup style={{ borderRadius: '10px' }}>
        <SidebarStep
          step={1}
          text="SELECT YOUR TEMPLATE"
          isActivated={currentStep === 1}
        />
        <SidebarStep
          step={2}
          text="CONFIGURE YOUR SMART CONTRACT"
          isActivated={currentStep === 2}
        />
        <SidebarStep
          step={3}
          text="DEFINE YOUR COMMUNITY ROLES"
          isActivated={currentStep === 3}
        />
        <SidebarStep
          step={4}
          text="REVIEW AND LAUNCH"
          isActivated={currentStep === 4}
        />

        {/* Help link */}
        <ListGroup.Item className={style.footer}>
          <QuestionCircle size={20} style={{ marginRight: '5px' }} />
          <p style={{ display: 'inline', verticalAlign: 'middle' }}>
            Having issues? Questions?
            {' '}
            <a target="_blank" href="https://www.zkladder.com/#join" rel="noreferrer">Get in touch here.</a>
          </p>
        </ListGroup.Item>
      </ListGroup>

    </Container>
  );
}

export default MemberMintSidebar;
