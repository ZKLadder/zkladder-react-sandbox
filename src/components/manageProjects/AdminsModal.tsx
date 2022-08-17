import React, { useState } from 'react';
import {
  Modal, Container, Row, Col, Form, Button, Spinner,
} from 'react-bootstrap';
import { useRecoilValueLoadable, useRecoilRefresher_UNSTABLE as useRecoilRefresherUnstable, useRecoilValue } from 'recoil';
import { utilities } from '@zkladder/zkladder-sdk-ts';
import { contractsWithMetadataState, selectedContractState, writableContractState } from '../../state/contract';
import style from '../../styles/deploy.module.css';
import projectStyle from '../../styles/manageProjects.module.css';
import Error from '../shared/Error';
import { updateContract } from '../../utils/api';

function AdminsModal({ open, closeModal }:{open:string, closeModal:()=>void}) {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address, chainId } = useRecoilValue(selectedContractState);
  const admins = contractsWithMetadata?.contents?.[address as string]?.admins;
  const writeableContract = useRecoilValueLoadable(writableContractState)?.contents;
  const refresh = useRecoilRefresherUnstable(contractsWithMetadataState);
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Modal
      show={!!open.length}
      onHide={closeModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container className={style['template-wrapper']}>
        {/* Title */}
        <p className={style['form-label']} style={{ fontSize: '16px', textAlign: 'center' }}>
          {open === 'admin' ? 'REGISTER NEW ADMINISTRATOR' : 'REGISTER NEW MINTER'}
        </p>
        <hr />

        {/* Form Fields */}
        <Row style={{ margin: '0px' }} className={style['form-wrapper']}>
          <Col>
            <Form.Label className={style['form-label']}>USER ADDRESS</Form.Label>
            <Form.Control
              data-testid="addressInput"
              className={style['form-input']}
              type="text"
              value={userAddress}
              onChange={(event) => { setUserAddress(event.target.value); }}
            />
          </Col>
          <p style={{ margin: '5px 14px 5px 14px', textAlign: 'center' }} className={style['form-label']}>
            {open === 'admin' ? 'This account will be able to configure contract settings like roles, royalties and transferability, as well as create new admins and minters'
              : 'This account will be approved to sign mint vouchers and mint new tokens'}
          </p>
        </Row>

        {/* Action Buttons */}
        <Row className="justify-content-end" style={{ margin: '0px' }}>
          <Col style={{ padding: '0px' }} className="col-auto">
            {loading ? (
              <span style={{ display: 'inline-block', paddingTop: '8px' }}>
                <Spinner size="sm" style={{ color: '#4EB9B1' }} animation="border" />
              </span>
            ) : null}
          </Col>
          <Col className="col-auto">

            {/* Save Button */}
            <Button
              className={projectStyle['add-whitelist-record']}
              onClick={async () => {
                try {
                  if (writeableContract) {
                    setLoading(true);
                    setError('');

                    utilities.isEthereumAddress(userAddress);

                    let tx;
                    if (open === 'admin') {
                      tx = await writeableContract.grantRole('DEFAULT_ADMIN_ROLE', userAddress);
                      await updateContract({
                        address: address as string,
                        chainId: chainId as string,
                        admins: admins ? [...admins, userAddress.toLowerCase()] : [userAddress.toLowerCase()],
                      });
                    } else {
                      tx = await writeableContract.grantRole('MINTER_ROLE', userAddress);
                    }
                    await tx.wait();

                    refresh();
                    setLoading(false);
                    closeModal();
                  }
                } catch (err:any) {
                  setLoading(false);
                  setError(err.message || 'Error creating record');
                }
              }}
            >
              ADD RECORD
            </Button>

            {/* Cancel Button */}
            <Button
              className={projectStyle['remove-whitelist-record']}
              onClick={() => {
                setError('');
                setLoading(false);
                closeModal();
              }}
            >
              CANCEL
            </Button>

          </Col>
        </Row>
        {error.length ? <Error text={error} /> : null}
      </Container>

    </Modal>
  );
}

export default AdminsModal;
