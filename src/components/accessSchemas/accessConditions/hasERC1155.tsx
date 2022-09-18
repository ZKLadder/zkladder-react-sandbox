import React, { useEffect, useState } from 'react';
import {
  Row, Col, Form, Dropdown,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import {
  AccessValidator, MemberNftV2,
} from '@zkladder/zkladder-sdk-ts';
import networks from '../../../constants/networks';
import { dropUpdatesState } from '../../../state/drop';
import style from '../../../styles/deploy.module.css';
import config from '../../../config';

function HasBalanceERC20({ index }: { index:number }) {
  const [dropUpdates, setDropUpdates] = useRecoilState(dropUpdatesState);
  const accessCondition = dropUpdates?.accessSchema?.[index];

  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // useEffect to fetch contract name as proxy for existence of ERC1155 contract
  useEffect(() => {
    const fetchName = async () => {
      if (accessCondition?.contractAddress && accessCondition?.key === 'hasERC1155') {
        try {
          const memberNft = await MemberNftV2.setup({
            address: accessCondition?.contractAddress,
            chainId: accessCondition?.chainId,
            infuraIpfsProjectId: config.ipfs.projectId,
            infuraIpfsProjectSecret: config.ipfs.projectSecret,
          });

          await memberNft.name();

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
    fetchName();
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
              const memberNft = await MemberNftV2.setup({
                address: accessCondition?.contractAddress,
                chainId: accessCondition?.chainId,
                infuraIpfsProjectId: config.ipfs.projectId,
                infuraIpfsProjectSecret: config.ipfs.projectSecret,
              });

              await memberNft.name();

              const validator = new AccessValidator(dropUpdates?.accessSchema);
              validator.updateAccessCondition({ index, contractAddress: address });

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

      {/* Token ID Field */}
      <Col lg={4}>
        <Form.Label className={style['form-label']} style={{ marginTop: '10px' }}>TOKEN ID</Form.Label>
        <Form.Control
          className={style['form-input']}
          type="text"
          data-testid="tokenId"
          value={accessCondition?.parameters[1]}
          onChange={(event) => {
            const validator = new AccessValidator(dropUpdates?.accessSchema);
            validator.updateAccessCondition({ index, tokenId: event.target.value });
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
