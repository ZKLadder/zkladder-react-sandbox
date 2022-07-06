import React, { useState } from 'react';
import {
  Col, Form, Button,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import networks from '../../../constants/networks';
import { accessValidatorState } from '../SchemaBuilder';

/* eslint-disable-next-line */
function HasBalanceERC20({ accessOperator }: { accessOperator?:string}) {
  const [jsonSchema, setJsonSchema] = useRecoilState(accessValidatorState);
  const [chainId, setChainId] = useState(1);
  const [minBalance, setMinBalance] = useState(0);
  const [contractAddress, setContractAddress] = useState('');
  const [decimals, setDecimals] = useState(18);

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

      <Form.Label style={{ display: 'block', margin: '15px 0px 0px 0px' }}>Decimals</Form.Label>
      <Form.Control
        type="number"
        value={decimals}
        onChange={(event) => { setDecimals(parseInt(event.target.value, 10)); }}
      />

      <Form.Label style={{ display: 'block', margin: '15px 0px 0px 0px' }}>Minimum Balance</Form.Label>
      <Form.Control
        type="number"
        value={minBalance}
        onChange={(event) => { setMinBalance(parseFloat(event.target.value)); }}
      />

      <Button
        style={{ marginTop: '10px' }}
        onClick={
            () => {
              validator.addAccessCondition({
                key: 'hasBalanceERC20', chainId, minBalance, decimals, contractAddress,
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

export default HasBalanceERC20;
