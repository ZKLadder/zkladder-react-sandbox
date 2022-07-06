import React, { useState } from 'react';
import {
  Col, Form, Button,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import { accessValidatorState } from '../SchemaBuilder';

/* eslint-disable-next-line */
function Timelock({ accessOperator }: { accessOperator?:string}) {
  const [jsonSchema, setJsonSchema] = useRecoilState(accessValidatorState);
  const [comparator, setComparator] = useState('>=');
  const [timestamp, setTimestamp] = useState(new Date('6-30-2022').toISOString().slice(0, -1));

  const validator = new AccessValidator(jsonSchema);

  return (
    <Col style={{ border: '1px solid #D5D5D5', margin: '10px', padding: '10px' }}>
      <Form.Label style={{ display: 'block', margin: '0px' }}>Allow Access</Form.Label>
      <Form.Select
        value={comparator}
        onChange={(event) => { setComparator(event.target.value); }}
      >
        <option value=">=">after</option>
        <option value="<=">before</option>
      </Form.Select>

      <Form.Label style={{ display: 'block', margin: '15px 0px 0px 0px' }}>Whitelisted Address</Form.Label>
      <Form.Control
        type="datetime-local"
        value={timestamp}
        onChange={(event) => { setTimestamp(new Date(event.target.value).toISOString().slice(0, -1)); }}
      />

      <Button
        style={{ marginTop: '10px' }}
        onClick={
            () => {
              validator.addAccessCondition({
                key: 'timelock', chainId: 1, comparator, timestamp: new Date(`${timestamp}Z`).getTime(),
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

export default Timelock;
