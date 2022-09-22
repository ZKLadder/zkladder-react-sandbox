import React, { useEffect, useState } from 'react';
import {
  Row, Col, Form, Dropdown,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { AccessValidator, ERC20, utilities } from '@zkladder/zkladder-sdk-ts';
import networks from '../../../constants/networks';
import { dropUpdatesState } from '../../../state/drop';
import style from '../../../styles/deploy.module.css';

function HasBalanceERC20({ index }: { index:number }) {
  const [dropUpdates, setDropUpdates] = useRecoilState(dropUpdatesState);
  const accessCondition = dropUpdates?.accessSchema?.[index];

  const [decimals, setDecimals] = useState(18);

  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // useEffect to fetch decimals when user inputs contractAddress
  useEffect(() => {
    const fetchDecimals = async () => {
      if (accessCondition?.contractAddress && accessCondition?.key === 'hasBalanceERC20') {
        try {
          const erc20 = ERC20.setup({ address: accessCondition?.contractAddress, chainId: accessCondition?.chainId });
          const result = await erc20.decimals();
          setDecimals(result);
          setIsValid(true);
          setError(false);
        } catch (err:any) {
          setError(true);
        }
      }
    };
    fetchDecimals();
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

      {/* Contract Address Field */}
      <Col lg={8}>
        <Form.Label className={style['form-label']} style={{ marginTop: '10px' }}>CONTRACT ADDRESS</Form.Label>
        <Form.Control
          className={style['form-input']}
          type="text"
          data-testid="contractAddress"
          isValid={!error && isValid}
          isInvalid={error}
          value={accessCondition?.contractAddress}
          onChange={async (event) => {
            const address = event.target.value;
            try {
              const erc20 = ERC20.setup({ address, chainId: accessCondition?.chainId });
              const result = await erc20.decimals();

              const validator = new AccessValidator(dropUpdates?.accessSchema);
              validator.updateAccessCondition({ index, contractAddress: address });
              validator.updateAccessCondition({
                index,
                minBalance: utilities.formatUnits(accessCondition?.returnValueTest.value, decimals),
                decimals: result,
              });

              setDecimals(result);
              setDropUpdates({
                ...dropUpdates,
                accessSchema: validator.getAccessSchema(),
              });
              setError(false);
              setIsValid(true);
            } catch (err:any) {
              const validator = new AccessValidator(dropUpdates?.accessSchema);
              validator.updateAccessCondition({ index, contractAddress: address });
              setDropUpdates({
                ...dropUpdates,
                accessSchema: validator.getAccessSchema(),
              });
              setError(error);
            }
          }}
        />
      </Col>

      {/* Minimum Balance Field */}
      <Col lg={4}>
        <Form.Label className={style['form-label']} style={{ marginTop: '10px' }}>MINIMUM BALANCE</Form.Label>
        <Form.Control
          className={style['form-input']}
          type="number"
          data-testid="minBalance"
          value={utilities.formatUnits(accessCondition?.returnValueTest.value, decimals)}
          onChange={(event) => {
            const validator = new AccessValidator(dropUpdates?.accessSchema);
            validator.updateAccessCondition({ index, minBalance: parseFloat(event.target.value), decimals });
            setDropUpdates({
              ...dropUpdates,
              accessSchema: validator.getAccessSchema(),
            });
          }}
        />
      </Col>
    </Row>
  );
}

export default HasBalanceERC20;
