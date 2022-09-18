import React from 'react';
import {
  Row, Col, Form, Dropdown,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { AccessValidator, utilities } from '@zkladder/zkladder-sdk-ts';
import networks from '../../../constants/networks';
import { dropUpdatesState } from '../../../state/drop';
import style from '../../../styles/deploy.module.css';

function HasBalance({ index }: { index:number }) {
  const [dropUpdates, setDropUpdates] = useRecoilState(dropUpdatesState);
  const accessCondition = dropUpdates?.accessSchema?.[index];

  return (
    <Row style={{ marginTop: '5px' }}>

      {/* Network Field */}
      <Col>
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
          <Dropdown.Menu
            align="end"
            style={{
              minWidth: '100%', padding: '1px', maxHeight: '110px', overflow: 'auto',
            }}
            className={style['form-dropdown']}
          >
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

        {/* Minimum Balance Field */}
        <Form.Label className={style['form-label']} style={{ marginTop: '10px' }}>MINIMUM BALANCE</Form.Label>
        <Form.Control
          className={style['form-input']}
          type="number"
          data-testid="minBalance"
          value={utilities.weiToEth(accessCondition?.returnValueTest.value).toString()}
          onChange={(event) => {
            const validator = new AccessValidator(dropUpdates?.accessSchema);
            validator.updateAccessCondition({ index, minBalance: parseFloat(event.target.value) });
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

export default HasBalance;
