import React, { useState } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import {
  CheckSquare, PlusCircleFill, TrashFill, XCircle,
} from 'react-bootstrap-icons';
import { useRecoilState } from 'recoil';
import { currentDropState } from '../../../../state/page';
import style from '../../../../styles/deploy.module.css';
import projectStyle from '../../../../styles/manageProjects.module.css';
import { deleteAssets, getDrops } from '../../../../utils/api';
import AssetUploadModal from './UploadAssetModal';

function UploadAssets() {
  const [currentDrop, setCurrentDrop] = useRecoilState(currentDropState);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
      <AssetUploadModal show={modalOpen} onHide={() => { setModalOpen(false); }} />
      <Row>

        {/* Uploaded Count */}
        <Col lg={4} className="pt-2">
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
            ASSETS UPLOADED:
            {' '}
            <span style={{
              padding: '5px 8px 5px 8px', backgroundColor: '#F5F5F5', margin: '0px 0px 0px 5px', borderRadius: '5px',
            }}
            >
              {currentDrop?.assets.length}
            </span>
          </span>
        </Col>

        {/* Uploaded More Button */}
        <Col className="text-right pt-2" lg={8}>
          <span
            className={projectStyle['add-whitelist-record']}
            style={{
              marginTop: '100px', fontSize: '14px', padding: '15px 20px 15px 20px', borderRadius: '5px',
            }}
            onClick={() => { setModalOpen(true); }}
            role="button"
            tabIndex={-1}
          >
            <PlusCircleFill size={20} className={projectStyle['add-whitelist-icon']} />
            UPLOAD MORE
          </span>
        </Col>
        <Col lg={12}><hr /></Col>

        {/* Assets Button */}
        <Col style={{ maxHeight: '300px', overflow: 'auto' }}>
          {currentDrop?.assets?.length ? (
            <Table borderless>
              <tbody>
                <tr className={projectStyle['table-head']}>
                  <th>TOKEN URI</th>
                  <th>MINTED</th>
                </tr>
                {currentDrop?.assets?.map((asset) => (
                  <tr key={asset.id}>
                    <td style={{ padding: '2px 2px 2px 10px' }}>
                      <div className={projectStyle['table-data']}>{asset.tokenUri}</div>
                    </td>
                    <td style={{ padding: '2px' }}>
                      <div className={`${projectStyle['table-data']} text-center`}>{asset.isMinted ? <CheckSquare style={{ color: '#4EB9B1' }} size={15} /> : <XCircle style={{ color: '#DB0056' }} size={15} />}</div>
                    </td>
                    <td style={{ padding: '10px 0px 0px 0px' }} className="text-center">
                      <TrashFill
                        data-testid={`${asset.id}-delete`}
                        onClick={async () => {
                          await deleteAssets({
                            assetIds: [asset.id],
                          });

                          const [drop] = await getDrops({
                            id: currentDrop?.id,
                          });

                          setCurrentDrop(drop);
                        }}
                        size={18}
                        className={projectStyle['drop-form-step-icon-active']}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
            : (
              <p style={{ margin: '30px 0px 30px 0px' }} className={projectStyle['metrics-title']}>
                No assets uploaded yet
              </p>
            )}
        </Col>
      </Row>
    </div>
  );
}

export default UploadAssets;
