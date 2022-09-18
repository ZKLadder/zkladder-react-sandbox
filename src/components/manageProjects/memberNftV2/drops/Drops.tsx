import React from 'react';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import {
  useRecoilValue, useRecoilValueLoadable, useSetRecoilState,
} from 'recoil';
import style from '../../../../styles/deploy.module.css';
import projectStyle from '../../../../styles/manageProjects.module.css';

import DropTable from './DropTable';
import {
  dropSectionState, manageProjectsPageState,
} from '../../../../state/page';

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
