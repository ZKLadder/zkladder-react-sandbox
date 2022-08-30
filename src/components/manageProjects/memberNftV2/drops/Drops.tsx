import React from 'react';
import {
  Container, Row, Col, Form,
} from 'react-bootstrap';
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import style from '../../../../styles/deploy.module.css';
import projectStyle from '../../../../styles/manageProjects.module.css';
import Tooltip from '../../../shared/Tooltip';
import DropTable from './DropTable';
import { dropSectionState, manageProjectsPageState } from '../../../../state/page';
import AirDrop from './AirDrop';
import { ContractWithMetadata } from '../../../../interfaces/contract';
import { contractsWithMetadataState, selectedContractState } from '../../../../state/contract';
import ManageDrop from './ManageDrop';

function Drops() {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address } = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string] as ContractWithMetadata;
  const dropSection = useRecoilValue(dropSectionState);
  const setManageProjectsSection = useSetRecoilState(manageProjectsPageState);

  const hasTiers = ((contractData?.tiers?.length || 0) > 0);

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

      {/* No membership tiers created yet */}
      {!hasTiers ? (
        <Row
          className={`${style['form-wrapper']} mx-0 px-0 py-4`}
          style={{ margin: '3px 0px 0px 0px' }}
        >
          {/* No Tiers Message */}
          <Col lg={8} className="px-4 pt-3">
            <p style={{ color: '#525252', fontSize: '14px', fontWeight: 'bold' }}>
              {'You must create at least one tier for this community before you can mint any NFT\'s'}
            </p>
          </Col>

          {/* Add Tier Button */}
          <Col className="px-5 pt-3">
            <div
              role="button"
              className={projectStyle['switch-chain-notice']}
              tabIndex={0}
              style={{ fontWeight: 'bold', fontSize: '14px', color: '#4EB9B1' }}
              onClick={() => { setManageProjectsSection('tiers'); }}
            >
              ADD A NEW TIER
            </div>
          </Col>
        </Row>
      ) : null}

      {(hasTiers && dropSection === 'dropTable') ? <DropTable /> : null}
      {(hasTiers && dropSection === 'airDrop') ? <AirDrop /> : null}
      {(hasTiers && dropSection === 'manageDrop') ? <ManageDrop /> : null}

    </Container>

  );
}

export default Drops;
