import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import {
  Gear, Palette, Shop,
} from 'react-bootstrap-icons';
import { useSetRecoilState } from 'recoil';
import projectStyle from '../../../../styles/manageProjects.module.css';
import ConfigureDrop from './ConfigureDrop';
import { dropSectionState } from '../../../../state/page';
import UploadAssets from './UploadAssets';

function ManageDrop() {
  const [manageDropSection, setManageDropSection] = useState('configure');
  const setDropSection = useSetRecoilState(dropSectionState);

  return (
    <div>
      <Row style={{ margin: '3px 0px 0px 0px' }}>

        {/* Configure Drop Tab */}
        <Col className="px-0 pr-1" lg={3}>
          <span
            className={`${manageDropSection === 'configure' ? projectStyle['drop-form-step-active'] : projectStyle['drop-form-step']} text-center`}
            role="button"
            onClick={() => { setManageDropSection('configure'); }}
            tabIndex={0}
          >
            <Gear size={22} className={manageDropSection === 'configure' ? projectStyle['drop-form-step-icon-active'] : projectStyle['drop-form-step-icon']} />
            CONFIGURE DROP
          </span>
        </Col>

        {/* Upload Assets Tab */}
        <Col className="px-0 pr-1" lg={3}>
          <span
            className={`${manageDropSection === 'assets' ? projectStyle['drop-form-step-active'] : projectStyle['drop-form-step']} text-center`}
            role="button"
            onClick={() => { setManageDropSection('assets'); }}
            tabIndex={0}
          >
            <Palette size={22} className={manageDropSection === 'assets' ? projectStyle['drop-form-step-icon-active'] : projectStyle['drop-form-step-icon']} />
            UPLOAD ASSETS
          </span>
        </Col>

        {/* Customize Mint Page Tab */}
        <Col className="px-0 pr-1" lg={3}>
          <span
            className={`${manageDropSection === 'style' ? projectStyle['drop-form-step-active'] : projectStyle['drop-form-step']} text-center`}
            role="button"
            onClick={() => { setManageDropSection('style'); }}
            tabIndex={0}
          >
            <Shop size={22} className={manageDropSection === 'style' ? projectStyle['drop-form-step-icon-active'] : projectStyle['drop-form-step-icon']} />
            CUSTOMIZE MINT PAGE
          </span>
        </Col>

        {/* Cancel Button */}
        <Col className="text-right" style={{ paddingTop: '33px' }}>
          <span
            role="button"
            tabIndex={0}
            style={{
              color: '#4EB9B1', float: 'none', fontWeight: 'bold',
            }}
            className={projectStyle['switch-chain-notice']}
            onClick={() => { setDropSection('dropTable'); }}
          >
            GO BACK
          </span>
        </Col>
      </Row>
      {manageDropSection === 'configure' ? <ConfigureDrop /> : null}
      {manageDropSection === 'assets' ? <UploadAssets /> : null}
    </div>
  );
}

export default ManageDrop;
