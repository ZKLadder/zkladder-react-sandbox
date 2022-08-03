import React, { useEffect, useState } from 'react';
import {
  Modal, Container, Row, Col, Form, Button, Dropdown, Spinner,
} from 'react-bootstrap';
import { useRecoilValue, useRecoilValueLoadable, useRecoilRefresher_UNSTABLE as useRecoilRefresherUnstable } from 'recoil';
import { utilities } from '@zkladder/zkladder-sdk-ts';
import style from '../../styles/deploy.module.css';
import projectStyle from '../../styles/manageProjects.module.css';
import {
  contractsWithMetadataState, selectedContractState, writableContractState, WhitelistState,
} from '../../state/contract';
import { storeVoucher } from '../../utils/api';
import Error from '../shared/Error';

function WhitelistModal({ open, closeModal }:{open:boolean, closeModal:()=>void}) {
  const { address } = useRecoilValue(selectedContractState);
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const contractData = contractsWithMetadata?.contents?.[address as string];

  const refresh = useRecoilRefresherUnstable(WhitelistState);

  const writeableContract = useRecoilValueLoadable(writableContractState)?.contents;

  const [voucherData, setVoucherData] = useState({
    quantity: 1,
    userAddress: '',
    roleId: '',
    contractAddress: address,
    note: '',
  });

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Synchronize the roleId when index changes on the form select
  useEffect(() => {
    voucherData.roleId = contractData?.roles?.[currentRoleIndex]?.id;
  }, [currentRoleIndex]);

  return (
    <Modal
      show={open}
      onHide={closeModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container className={style['template-wrapper']}>
        {/* Modal Header */}
        <p className={style['form-label']} style={{ fontSize: '16px', textAlign: 'center' }}>
          ADD ACCOUNT TO WHITELIST
        </p>
        <hr />

        {/* Form Fields */}
        <Row style={{ margin: '0px' }} className={style['form-wrapper']}>
          <Col>
            <Form.Label className={style['form-label']}>USER ADDRESS</Form.Label>
            <Form.Control
              data-testid="userAddress"
              className={style['form-input']}
              type="text"
              value={voucherData.userAddress}
              onChange={(event) => { setVoucherData({ ...voucherData, userAddress: event.target.value }); }}
            />
          </Col>
        </Row>

        <Row style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
          <Col lg={8}>
            <Form.Label className={style['form-label']}>WHITELISTED ROLE</Form.Label>
            <Dropdown>
              <Dropdown.Toggle style={{ minWidth: '90%', textAlign: 'left', color: '#16434B' }} variant="light" className={style['form-dropdown']}>
                {contractData?.roles?.[currentRoleIndex]?.name}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ minWidth: '90%', padding: '1px' }} className={style['form-dropdown']}>
                {contractData?.roles?.map((role: any, index: any) => (
                  <Dropdown.Item
                    key={role.name || index}
                    onClick={() => {
                      setCurrentRoleIndex(index);
                    }}
                  >
                    {role.name || 'Unnamed Role'}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col>
            <Form.Label className={style['form-label']}>QUANTITY</Form.Label>
            <Form.Control
              data-testid="quantity"
              className={style['form-input']}
              type="number"
              value={voucherData.quantity}
              onChange={(event) => { setVoucherData({ ...voucherData, quantity: parseInt(event.target.value, 10) }); }}
            />
          </Col>
        </Row>

        <Row style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
          <Col>
            <Form.Label className={style['form-label']}>NOTE (OPTIONAL)</Form.Label>
            <Form.Control
              data-testid="note"
              className={style['form-input']}
              type="text"
              value={voucherData.note}
              onChange={(event) => { setVoucherData({ ...voucherData, note: event.target.value }); }}
            />
          </Col>
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

                    utilities.isEthereumAddress(voucherData.userAddress);

                    const voucher = await writeableContract.signMintVoucher(
                      voucherData.userAddress,
                      voucherData.quantity,
                      voucherData.roleId,
                    );

                    await storeVoucher({
                      contractAddress: address as string,
                      userAddress: voucherData.userAddress,
                      balance: voucher?.balance as number,
                      roleId: voucherData.roleId,
                      chainId: contractData?.chainId?.toString() as string,
                      signedVoucher: voucher as any,
                    });

                    refresh();
                    setLoading(false);
                    closeModal();
                  }
                } catch (err:any) {
                  setLoading(false);
                  setError(err.message || 'Error generating mint voucher');
                }
              }}
            >
              SAVE VOUCHER
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

export default WhitelistModal;
