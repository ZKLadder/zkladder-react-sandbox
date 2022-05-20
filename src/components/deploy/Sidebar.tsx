import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  Container, ListGroup, Row, Col,
} from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';
import logo from '../../images/memberMint/logo_transparent.png';
import style from '../../styles/deploy.module.css';
import SidebarStep from '../shared/SidebarStep';
import { deployState } from '../../state/deploy';

function DeploySidebar() {
  const { currentStep } = useRecoilValue(deployState);
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
      <p className={style.title} style={{ marginTop: '15px' }}>
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
          text="SELECT TEMPLATE"
          isActivated={currentStep === 1}
        />
        <SidebarStep
          step={2}
          text="CONFIGURE SMART CONTRACT"
          isActivated={currentStep === 2}
        />
        <SidebarStep
          step={3}
          text="DEFINE COMMUNITY ROLES"
          isActivated={currentStep === 3}
        />
        <SidebarStep
          step={4}
          text="REVIEW AND LAUNCH"
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

export default DeploySidebar;
