import React from 'react';
import {
  Container, Row, Col, Form, InputGroup,
} from 'react-bootstrap';
import { useRecoilValue, useRecoilValueLoadable, useRecoilState } from 'recoil';
import { utilities } from '@zkladder/zkladder-sdk-ts';
import { contractsWithMetadataState, selectedContractState } from '../../state/contract';
import { nftContractUpdates } from '../../state/nftContract';
import style from '../../styles/deploy.module.css';

function Settings() {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const address = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string];

  const [contractUpdates, setContractUpdates] = useRecoilState(nftContractUpdates);

  return (
    <Container className={style['template-wrapper']}>
      <Row style={{ margin: '0px' }} className={style['form-wrapper']}>

        {/* Contract Name */}
        <Col lg={5}>
          <Form.Label className={style['form-label']}>CONTRACT NAME</Form.Label>
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

      {/* Contract Description */}
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

      {/* Contract isTransferable */}
      <Row style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
        <Col>
          <Form.Check>
            <Form.Check.Input
              data-testid="transferable"
              style={{ marginTop: '6px' }}
              type="checkbox"
              checked={contractUpdates?.isTransferable?.toString()
                ? contractUpdates?.isTransferable : contractData?.isTransferable}
              onChange={() => {
                const currentState = contractUpdates?.isTransferable?.toString()
                  ? contractUpdates?.isTransferable : contractData?.isTransferable;

                setContractUpdates({
                  ...contractUpdates,
                  isTransferable: !currentState,
                });
              }}
            />
            <Form.Check.Label />
            <span style={{ fontSize: '13px' }} className={style['form-label']}>TRANSFERABLE</span>
          </Form.Check>
        </Col>
      </Row>

      {/* Contract royaltyBasis */}
      <Row style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
        <Col lg={4}>
          <Form.Label className={style['form-label']}>ROYALTY ON SECONDARY SALES</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text
              style={{ borderRadius: '5px 0px 0px 5px', color: '#16434B', fontSize: '14px' }}
              className={style['form-input']}
            >
              %
            </InputGroup.Text>
            <Form.Control
              data-testid="royalty"
              style={{ maxWidth: '35%' }}
              className={style['form-input']}
              type="number"
              min={0}
              value={contractUpdates.royaltyBasis?.toString() ? contractUpdates.royaltyBasis / 100 : contractData?.royaltyPercent}
              onChange={(event) => {
                setContractUpdates({
                  ...contractUpdates,
                  royaltyBasis: parseInt(event.target.value, 10) * 100,
                });
              }}
            />
          </InputGroup>
        </Col>

        {/* Contract beneficiaryAddress */}
        <Col lg={5}>
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
                // Do nothing
              }
            }}
          />
        </Col>
      </Row>
    </Container>

  );
}

export default Settings;
