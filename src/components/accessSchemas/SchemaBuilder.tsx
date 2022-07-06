import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Form, Button,
} from 'react-bootstrap';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { schemaPageState } from '../../state/page';
import HasBalance from './accessConditions/hasBalance';
import HasBalanceERC20 from './accessConditions/hasBalanceERC20';
import ConditionDisplay from './ConditionDisplay';
import HasERC721 from './accessConditions/hasERC721';
import HasERC1155 from './accessConditions/hasERC1155';
import IsBlacklisted from './accessConditions/isBlacklisted';
import IsWhitelisted from './accessConditions/isWhitelisted';
import { createAccessSchema, updateAccessSchema } from '../../utils/api';
import { walletState } from '../../state/wallet';
import Timelock from './accessConditions/timelock';

// @TODO Remove temporary atom when refactoring access schemas feature
const accessValidatorState = atom({
  key: 'accessValidatorState',
  default: [] as { [key: string]: any; }[],
});

function SchemaBuilder() {
  const [newGateType, setNewGateType] = useState('hasBalance');
  const [newGateName, setNewGateName] = useState('');
  const [accessOperator, setAccessOperator] = useState('and');
  const [schemaPage, setSchemaPageState] = useRecoilState(schemaPageState);
  const [accessJson, setAccessJson] = useRecoilState(accessValidatorState);
  const { address } = useRecoilValue(walletState);

  useEffect(() => {
    if (schemaPage.schema?.id) {
      setNewGateName(schemaPage.schema?.name);
      setAccessJson(schemaPage.schema?.accessSchema);
    } else {
      setNewGateName('');
      setAccessJson([]);
    }
  }, []);

  return (
    <div style={{ margin: '10px 25px 0px 25px' }}>
      <Card.Title>Token Gate Creator</Card.Title>
      <hr />
      <Button
        onClick={async () => {
          if (schemaPage.schema?.id) {
            await updateAccessSchema({ id: schemaPage.schema.id, name: newGateName, accessSchema: accessJson });
          } else {
            await createAccessSchema({ name: newGateName, accessSchema: accessJson, creatorAddress: address?.[0] as string });
          }
          setSchemaPageState({ section: 'list' });
        }}
        style={{ position: 'absolute', top: '20px', right: '140px' }}
      >
        Save Changes
      </Button>

      <Button
        onClick={() => {
          setSchemaPageState({ section: 'list' });
        }}
        style={{ position: 'absolute', top: '20px', right: '40px' }}
      >
        Go Back
      </Button>
      <Form.Label>Token Gate Name</Form.Label>
      <Form.Control value={newGateName} onChange={(event) => { setNewGateName(event.target.value); }} type="text" />

      <hr />
      <div style={{ maxHeight: '500px', overflow: 'auto' }}>
        {accessJson.map((schema, index) => (
          <ConditionDisplay jsonSchema={accessJson} index={index} />
        ))}
      </div>
      <hr />

      <Row>
        <Col>
          <Form.Label style={{ display: 'block' }}>Add Gate Condition</Form.Label>
          <Form.Select
            onChange={(event) => {
              setNewGateType(event.target.value);
            }}
          >
            <option value="hasBalance">Require minimum balance of ETH or other native coin</option>
            <option value="hasBalanceERC20">Require minimum balance of an ERC20 token</option>
            {/* <option value="hasLensFollow">Require following a profile on Aave Lens</option> */}
            <option value="hasERC721">Require ownership of an ERC721 NFT</option>
            <option value="hasERC1155">Require ownership of an ERC1155 token</option>
            <option value="timelock">Create timelock</option>
            <option value="isWhitelisted">Add single address to whitelist</option>
            <option value="isBlacklisted">Add single address to blacklist</option>
          </Form.Select>
        </Col>
        <Col>
          {accessJson.length === 1 ? (
            <div>
              <Form.Label style={{ display: 'block' }}>Access Operator</Form.Label>
              <Form.Select
                value={accessOperator}
                onChange={(event) => { setAccessOperator(event.target.value); }}
              >
                <option value="and">AND</option>
                <option value="or">OR</option>
              </Form.Select>
            </div>
          ) : null}
        </Col>
      </Row>
      <Row>
        {{
          hasBalance: <HasBalance accessOperator={accessOperator} />,
          hasBalanceERC20: <HasBalanceERC20 accessOperator={accessOperator} />,
          hasERC721: <HasERC721 accessOperator={accessOperator} />,
          hasERC1155: <HasERC1155 accessOperator={accessOperator} />,
          isBlacklisted: <IsBlacklisted accessOperator={accessOperator} />,
          isWhitelisted: <IsWhitelisted accessOperator={accessOperator} />,
          timelock: <Timelock accessOperator={accessOperator} />,
        }[newGateType]}
      </Row>
    </div>
  );
}

export default SchemaBuilder;
export { accessValidatorState };
