import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { currentDropState } from '../../../../state/drop';
import style from '../../../../styles/deploy.module.css';
import projectStyle from '../../../../styles/manageProjects.module.css';
import AssetUploadModal from './UploadAssetModal';

function MintWidget() {
  const currentDrop = useRecoilValue(currentDropState);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <AssetUploadModal show={modalOpen} onHide={() => { setModalOpen(false); }} />
      <Row style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>

        {/* Uploaded Count */}
        <Col lg={12} className="pt-2">
          <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0px' }}>CODE SNIPPET</p>
          <p style={{ fontSize: '14px', marginBottom: '5px' }}>Embed the code snippet below into your application to enable minting</p>
        </Col>

      </Row>
      <Row style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
        {/* Assets Button */}
        <Col style={{ minHeight: '100px' }}>
          <div className={projectStyle['table-data']}>
            <p style={{ margin: '5px 0px 5px 0px' }}>{`<div id="anchor" data-dropid="${currentDrop?.id}" />`}</p>
            <p style={{ margin: '5px 0px 5px 0px' }}>{'<script type="module" src="https://embeds.zkladder.com"></script>'}</p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default MintWidget;
