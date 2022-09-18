import React, { useEffect, useState } from 'react';
import {
  Row, Col, Form, Dropdown,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import {
  AccessValidator, utilities,
} from '@zkladder/zkladder-sdk-ts';
import { isEthereumAddress } from '@zkladder/zkladder-sdk-ts/dist/interfaces/address';
import networks from '../../../constants/networks';
import { dropUpdatesState } from '../../../state/drop';
import style from '../../../styles/deploy.module.css';

function IsWhitelisted({ index }: { index:number }) {
  const [dropUpdates, setDropUpdates] = useRecoilState(dropUpdatesState);
  const accessCondition = dropUpdates?.accessSchema?.[index];

  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // useEffect to validate address input
  useEffect(() => {
    const checkAddress = async () => {
      if (accessCondition?.returnValueTest.value) {
        try {
          utilities.isEthereumAddress(accessCondition?.returnValueTest.value);
          setIsValid(true);
          setError(false);
        } catch (err:any) {
          setError(true);
        }
      } else {
        setIsValid(false);
        setError(false);
      }
    };
    checkAddress();
  }, [dropUpdates]);

  return (
    <Row style={{ marginTop: '5px' }}>

      {/* Network Field */}
      <Col lg={12}>
        <Form.Label
          className={style['form-label']}
          style={{ marginTop: '5px', display: 'block' }}
        >
          NETWORK
        </Form.Label>
        <Dropdown>
          <Dropdown.Toggle
            data-testid="toggleNetwork"
            style={{
              minWidth: '100%', textAlign: 'left', color: '#16434B', display: 'inline',
            }}
            variant="light"
            className={style['form-dropdown']}
          >
            {(networks as any)[accessCondition?.chainId]?.label}
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" style={{ minWidth: '100%', padding: '1px' }} className={style['form-dropdown']}>
            {Object.keys(networks).map((network) => (
              <Dropdown.Item
                key={(networks as any)[network].label}
                onClick={() => {
                  const validator = new AccessValidator(dropUpdates?.accessSchema);
                  validator.updateAccessCondition({ index, chainId: parseInt(network, 10) });
                  setDropUpdates({
                    ...dropUpdates,
                    accessSchema: validator.getAccessSchema(),
                  });
                }}
              >
                {(networks as any)[network].label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>

      {/* Whitelisted Address Field */}
      <Col lg={12}>
        <Form.Label className={style['form-label']} style={{ marginTop: '10px' }}>WHITELISTED ADDRESS</Form.Label>
        <Form.Control
          key="whitelistedAddress"
          className={style['form-input']}
          type="text"
          data-testid="whitelistedAddress"
          isValid={!error && isValid}
          isInvalid={error}
          value={accessCondition?.returnValueTest.value}
          onChange={async (event) => {
            const address = event.target.value;
            try {
              isEthereumAddress(event.target.value);

              const validator = new AccessValidator(dropUpdates?.accessSchema);
              validator.updateAccessCondition({ index, whitelistedAddress: address });

              setDropUpdates({
                ...dropUpdates,
                accessSchema: validator.getAccessSchema(),
              });
              setError(false);
              setIsValid(true);
            } catch (err:any) {
              const validator = new AccessValidator(dropUpdates?.accessSchema);
              validator.updateAccessCondition({ index, whitelistedAddress: address });
              setDropUpdates({
                ...dropUpdates,
                accessSchema: validator.getAccessSchema(),
              });
              setError(error);
            }
          }}
        />
      </Col>
    </Row>
  );
}

export default IsWhitelisted;
