import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useSetRecoilState } from 'recoil';
import networks from '../../constants/networks';
import { accessValidatorState } from './SchemaBuilder';

function ConditionDisplay({ jsonSchema, index }:{jsonSchema:{ [key: string]: any; }[], index:number}) {
  const setJsonSchema = useSetRecoilState(accessValidatorState);

  const style = {
    backgroundColor: 'lightgray', padding: '10px', border: '1px solid gray', marginTop: '10px', position: 'relative',
  } as any;

  if (index % 2 === 1) return <div style={style}>{jsonSchema[index].operator.toUpperCase()}</div>;

  const name = jsonSchema[index].method || jsonSchema[index].functionName;
  const { parameters, chainId, contractAddress } = jsonSchema[index];
  const { comparator, value } = jsonSchema[index].returnValueTest;

  if (name === 'whitelist') {
    return (
      <div style={style}>
        <p>
          The users address must equal
          {' '}
          <b>{value}</b>
        </p>
        <Button
          onClick={() => {
            const validator = new AccessValidator(jsonSchema);
            validator.deleteAccessCondition(index);
            setJsonSchema(validator.getAccessSchema());
          }}
          style={{ position: 'absolute', top: '10px', right: '20px' }}
        >
          Delete Access Condition

        </Button>
      </div>
    );
  }

  if (name === 'blacklist') {
    return (
      <div style={style}>
        <p>
          The users address must not equal
          {' '}
          <b>{value}</b>
        </p>
        <Button
          onClick={() => {
            const validator = new AccessValidator(jsonSchema);
            validator.deleteAccessCondition(index);
            setJsonSchema(validator.getAccessSchema());
          }}
          style={{ position: 'absolute', top: '10px', right: '20px' }}
        >
          Delete Access Condition

        </Button>
      </div>
    );
  }

  if (name === 'timelock') {
    return (
      <div style={style}>
        <p>
          {`This token gate will be locked until ${comparator === '<=' ? 'before' : 'after'}`}
          {' '}
          <b>{new Date(value).toISOString()}</b>
        </p>
        <Button
          onClick={() => {
            const validator = new AccessValidator(jsonSchema);
            validator.deleteAccessCondition(index);
            setJsonSchema(validator.getAccessSchema());
          }}
          style={{ position: 'absolute', top: '10px', right: '20px' }}
        >
          Delete Access Condition

        </Button>
      </div>
    );
  }

  return (
    <div style={style}>
      <p>
        Chain:
        {' '}
        <b>{(networks as any)[chainId]?.label}</b>
      </p>
      {contractAddress ? (
        <p>
          Contract Address:
          {' '}
          <b>{contractAddress}</b>
        </p>
      ) : null}
      <p>
        Function Name:
        <b>{` ${name}`}</b>
      </p>
      <p>
        Access Condition:
        {' '}
        <b>{`Must return a value ${comparator} ${value}`}</b>
      </p>
      <p>{'When called with the paramaters: '}</p>
      <ul>
        {parameters.map((param:string) => (<li><b>{param}</b></li>))}
      </ul>
      <Button
        onClick={() => {
          const validator = new AccessValidator(jsonSchema);
          validator.deleteAccessCondition(index);
          setJsonSchema(validator.getAccessSchema());
        }}
        style={{ position: 'absolute', top: '10px', right: '20px' }}
      >
        Delete Access Condition

      </Button>
    </div>
  );
}

export default ConditionDisplay;
