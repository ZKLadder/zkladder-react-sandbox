import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import Sidebar from './Sidebar';
import sharedStyle from '../../styles/shared.module.css';
import { deployState } from '../../state/deploy';
import SelectTemplate from './SelectTemplate';
import ConfigureContract from './ConfigureContract';
import DefineRoles from './DefineRoles';
import Review from './Review';

function Deploy() {
  const { currentStep } = useRecoilValue(deployState);

  return (
    <Row className={sharedStyle['content-wrapper']}>
      <Col className={`${sharedStyle.sidebar} d-none d-lg-block`} lg={3}>
        <Sidebar />
      </Col>
      <Col>
        {currentStep === 1 ? <SelectTemplate /> : null}
        {currentStep === 2 ? <ConfigureContract /> : null}
        {currentStep === 3 ? <DefineRoles /> : null }
        {currentStep === 4 ? <Review /> : null }
      </Col>
    </Row>
  );
}

export default Deploy;
