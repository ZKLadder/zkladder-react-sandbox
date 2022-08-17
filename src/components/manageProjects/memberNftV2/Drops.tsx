import React from 'react';
import {
  Container, Row, Col, Form,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import style from '../../../styles/deploy.module.css';
import projectStyle from '../../../styles/manageProjects.module.css';
import Tooltip from '../../shared/Tooltip';
import DropTable from './DropTable';
import { dropSectionState } from '../../../state/page';
import AirDrop from './AirDrop';

function Drops() {
  const dropSection = useRecoilValue(dropSectionState);

  return (
    <Container className={style['template-wrapper']}>
      <Row style={{ margin: '0px' }} className={style['form-wrapper']}>

        {/* Enable Token Gates Checkbox */}
        <Col lg={4} style={{ border: '1px solid #F5F5F5', padding: '10px' }}>
          <Form.Check>
            <Form.Check.Input
              style={{ marginTop: '7px' }}
              type="checkbox"
              checked={false}
              readOnly
            />
            <Form.Check.Label />
            <span style={{ fontSize: '13px' }} className={style['form-label']}>ENABLE TOKEN-GATES</span>
            <Tooltip className={projectStyle.tooltip} header="Token-Gate Service" body="Allow our platform to automatically approve users for minting if they meet your token-gate conditions. If this service is not active, you will need to manually add all end-users to your allowlist." />
          </Form.Check>
        </Col>

        {/* Active Drops Count */}
        <Col lg={3} style={{ backgroundColor: '#F5F5F5', padding: '8px', marginLeft: '5px' }}>
          <p style={{ lineHeight: '17px' }} className={projectStyle['metrics-figure']}>0</p>
          <p style={{ lineHeight: '17px', margin: '0px' }} className={projectStyle['metrics-title']}>Active Drops</p>
        </Col>

        {/* Upcoming Drops Count */}
        <Col lg={3} style={{ backgroundColor: '#F5F5F5', padding: '8px', marginLeft: '5px' }}>
          <p style={{ lineHeight: '17px' }} className={projectStyle['metrics-figure']}>0</p>
          <p style={{ lineHeight: '17px', margin: '0px' }} className={projectStyle['metrics-title']}>Upcoming Drops</p>
        </Col>
      </Row>

      {dropSection === 'dropTable' ? <DropTable /> : null}
      {dropSection === 'airDrop' ? <AirDrop /> : null}

    </Container>

  );
}

export default Drops;
