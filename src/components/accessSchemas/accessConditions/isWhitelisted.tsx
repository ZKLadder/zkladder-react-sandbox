import React, { useState } from 'react';
import {
  Col, Form, Button,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import networks from '../../../constants/networks';
import { accessValidatorState } from '../SchemaBuilder';

/* eslint-disable-next-line */
function IsWhitelisted({ accessOperator }: { accessOperator?:string}) {
  const [jsonSchema, setJsonSchema] = useRecoilState(accessValidatorState);
  const [chainId, setChainId] = useState(1);
  const [whitelistedAddress, setWhitelistedAddress] = useState('');

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

      <Form.Label style={{ display: 'block', margin: '15px 0px 0px 0px' }}>Whitelisted Address</Form.Label>
      <Form.Control
        type="text"
        value={whitelistedAddress}
        onChange={(event) => { setWhitelistedAddress(event.target.value); }}
      />

      <Button
        style={{ marginTop: '10px' }}
        onClick={
            () => {
              validator.addAccessCondition({
                key: 'isWhitelisted', chainId, whitelistedAddress,
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

export default IsWhitelisted;
