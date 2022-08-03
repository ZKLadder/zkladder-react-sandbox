import React from 'react';
import {
  Container, Row, Col, Form,
} from 'react-bootstrap';
import { useRecoilValue, useRecoilValueLoadable, useRecoilState } from 'recoil';
import { utilities } from '@zkladder/zkladder-sdk-ts';
import { contractsWithMetadataState, selectedContractState } from '../../../state/contract';
import { nftContractUpdates } from '../../../state/nftContract';
import style from '../../../styles/deploy.module.css';

function Settings() {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address } = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string];

  const [contractUpdates, setContractUpdates] = useRecoilState(nftContractUpdates);

  return (
    <Container className={style['template-wrapper']}>
      <Row style={{ margin: '0px' }} className={style['form-wrapper']}>

        {/* Community Name */}
        <Col lg={5}>
          <Form.Label className={style['form-label']}>COMMUNITY NAME</Form.Label>
          <Form.Control
            style={{ backgroundColor: '#D9D9D9' }}
            className={style['form-input']}
            type="text"
            value={contractData?.name}
            readOnly
          />
        </Col>

        {/* Contract Symbol */}
        <Col lg={3}>
          <Form.Label className={style['form-label']}>CONTRACT SYMBOL</Form.Label>
          <Form.Control
            style={{ backgroundColor: '#D9D9D9' }}
            className={style['form-input']}
            type="text"
            value={contractData?.symbol}
            readOnly
          />
        </Col>
        <Col className="align-items-end">
          <p style={{ margin: '35px 0px 0px 0px', color: '#525252', fontSize: '14px' }}>
            These fields cannot be edited
          </p>
        </Col>
      </Row>

      {/* Community Web Url (external_link) */}
      <Row style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
        <Col lg={8}>
          <Form.Label className={style['form-label']}>COMMUNITY WEB URL</Form.Label>
          <Form.Control
            data-testid="link"
            className={style['form-input']}
            type="text"
            value={contractUpdates?.external_link || contractData?.external_link}
            onChange={(event) => {
              setContractUpdates({
                ...contractUpdates,
                external_link: event.target.value,
              });
            }}
          />
        </Col>
      </Row>

      {/* Community Description */}
      <Row style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
        <Col lg={8}>
          <Form.Label className={style['form-label']}>DESCRIPTION</Form.Label>
          <Form.Control
            data-testid="description"
            className={style['form-input']}
            as="textarea"
            rows={4}
            value={contractUpdates?.description || contractData?.description}
            onChange={(event) => {
              setContractUpdates({
                ...contractUpdates,
                description: event.target.value,
              });
            }}
          />
        </Col>
      </Row>

      {/* Community beneficiaryAddress */}
      <Row style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
        <Col lg={8}>
          <Form.Label className={style['form-label']}>BENEFICIARY ADDRESS</Form.Label>
          <Form.Control
            data-testid="beneficiary"
            className={style['form-input']}
            type="text"
            value={contractUpdates.beneficiaryAddress || contractData?.beneficiary}
            onChange={(event) => {
              try {
                setContractUpdates({
                  ...contractUpdates,
                  beneficiaryAddress: utilities.isEthereumAddress(event.target.value) as string,
                });
              } catch (err:any) {
                // Do not update state as user is pasting in an invalid ETH address
              }
            }}
          />
        </Col>
      </Row>
    </Container>

  );
}

export default Settings;
