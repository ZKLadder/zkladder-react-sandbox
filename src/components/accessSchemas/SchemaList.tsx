import React, { useEffect, useState } from 'react';
import {
  Row, Button, Col, Table, Form,
} from 'react-bootstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import { schemaPageState } from '../../state/page';
import { getAccessSchemas } from '../../utils/api';
import { walletState } from '../../state/wallet';

function SchemaList() {
  const { address } = useRecoilValue(walletState);
  const setSchemaPageState = useSetRecoilState(schemaPageState);
  const [schemas, setSchemas] = useState([]) as any;
  const [addressesToCheck, setAddressesToCheck] = useState({}) as any;
  const [results, setResults] = useState({}) as any;
  useEffect(() => {
    const getSchemas = async () => {
      const schemaList = await getAccessSchemas({ creatorAddress: address?.[0] as string });
      setSchemas(schemaList);
    };
    getSchemas();
  }, []);
  return (
    <div>
      <Table>
        <tr>
          <th>Gate Name</th>
          <th>Test Gate</th>
          <th>Test Result</th>
        </tr>
        <tbody>
          {schemas.map((schema: any) => (
            <tr key={schema.id}>
              <td style={{ padding: '10px' }}>
                <button
                  style={{ border: 'none', backgroundColor: 'transparent' }}
                  type="button"
                  onClick={() => {
                    setSchemaPageState({ section: 'builder', schema });
                  }}
                >
                  {schema.name}
                </button>
              </td>
              <td style={{ padding: '10px' }}>
                <Row>
                  <Col xs={9}>
                    <Form.Control
                      value={addressesToCheck[schema.id] || ''}
                      onChange={(event) => {
                        const newAddresses = { ...addressesToCheck };
                        newAddresses[schema.id] = event.target.value;
                        setAddressesToCheck(newAddresses);
                      }}
                    />
                  </Col>
                  <Col>
                    <Button
                      onClick={async () => {
                        const newValidator = new AccessValidator(schema.accessSchema);
                        const result = await newValidator.validate(addressesToCheck[schema.id]);
                        const newResults = { ...results };
                        newResults[schema.id] = result ? 'Access Granted' : 'Access Denied';
                        setResults(newResults);
                      }}
                    >
                      Check
                    </Button>
                  </Col>
                </Row>
              </td>
              <td style={{ padding: '10px' }}>
                <div>{results[schema.id]}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        onClick={() => {
          setSchemaPageState({ section: 'builder' });
        }}
      >
        Add new Schema
      </Button>
    </div>
  );
}

export default SchemaList;
