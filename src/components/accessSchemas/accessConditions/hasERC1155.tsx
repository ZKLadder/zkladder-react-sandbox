import React, { useState } from 'react';
import {
  Col, Form, Button,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import networks from '../../../constants/networks';
import { accessValidatorState } from '../SchemaBuilder';

/* eslint-disable-next-line */
function HasERC1155({ accessOperator }: { accessOperator?:string}) {
  const [jsonSchema, setJsonSchema] = useRecoilState(accessValidatorState);
  const [chainId, setChainId] = useState(1);
  const [tokenId, setTokenId] = useState(0);
  const [contractAddress, setContractAddress] = useState('');

  const validator = new AccessValidator(jsonSchema);

  return (
    <Col style={{ border: '1px solid #D5D5D5', margin: '10px', padding: '10px' }}>
      <Form.Label style={{ display: 'block', margin: '0px' }}>ChainId</Form.Label>
      <Form.Select
        value={chainId}
        onChange={(event) => { setChainId(parseInt(event.target.value, 10)); }}
      >
        {Object.keys(networks).map((id) => <option value={id}>{(networks as any)[id]?.label}</option>)}
      </Form.Select>

      <Form.Label style={{ display: 'block', margin: '15px 0px 0px 0px' }}>Contract Address</Form.Label>
      <Form.Control
        type="text"
        value={contractAddress}
        onChange={(event) => { setContractAddress(event.target.value); }}
      />

      <Form.Label style={{ display: 'block', margin: '15px 0px 0px 0px' }}>TokenId</Form.Label>
      <Form.Control
        type="number"
        value={tokenId}
        onChange={(event) => { setTokenId(parseInt(event.target.value, 10)); }}
      />

      <Button
        style={{ marginTop: '10px' }}
        onClick={
            () => {
              validator.addAccessCondition({
                key: 'hasERC1155', chainId, contractAddress, tokenId,
              }, accessOperator);
              setJsonSchema(validator.getAccessSchema());
            }
          }
      >
        Add Gate Condition
      </Button>
    </Col>
  );
}

export default HasERC1155;
