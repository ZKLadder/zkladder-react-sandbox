import React, { useEffect, useState } from 'react';
import {
  Button,
  Col, Dropdown, Form, Row,
} from 'react-bootstrap';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { PlusCircleFill } from 'react-bootstrap-icons';
import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import style from '../../../../styles/deploy.module.css';
import projectStyle from '../../../../styles/manageProjects.module.css';
import { contractsWithMetadataState, selectedContractState } from '../../../../state/contract';
import { ContractWithMetadata } from '../../../../interfaces/contract';
import { currentDropState, dropUpdatesState } from '../../../../state/drop';
import { walletState } from '../../../../state/wallet';
import {
  createAccessSchema, getDrops, updateAccessSchema, updateDrop,
} from '../../../../utils/api';
import SchemaContainer from '../../../accessSchemas/SchemaContainer';

function ConfigureDrop() {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address } = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string] as ContractWithMetadata;

  const wallet = useRecoilValue(walletState);

  const [currentDrop, setCurrentDrop] = useRecoilState(currentDropState);
  const [dropUpdates, setDropUpdates] = useRecoilState(dropUpdatesState);

  const [accessOperator, setAccessOperator] = useState(currentDrop?.accessSchema?.accessSchema?.[1]?.operator || 'or');

  const [timeout, persistTimeout] = useState(0);

  // UseEffect to persist all updates to backend in realtime
  useEffect(() => {
    const saveDropUpdates = async () => {
      window.clearTimeout(timeout);

      persistTimeout(window.setTimeout(
        async () => {
          // Drop fields have changed
          if (dropUpdates.tierId || dropUpdates.name || dropUpdates.startTime || dropUpdates.endTime) {
            await updateDrop({
              ...dropUpdates,
              id: currentDrop?.id,
            });
            const [drop] = await getDrops({
              id: currentDrop?.id,
            });

            const validator = new AccessValidator(drop?.accessSchema?.accessSchema || []);
            setCurrentDrop(drop);
            setDropUpdates({ accessSchema: validator.getAccessSchema() });
          }

          // Access Schema has changed
          if (JSON.stringify(currentDrop?.accessSchema?.accessSchema) !== JSON.stringify(dropUpdates.accessSchema)) {
            if (currentDrop?.accessSchemaId) {
              await updateAccessSchema({ id: currentDrop.accessSchemaId, accessSchema: dropUpdates.accessSchema });
            } else {
              const { id } = await createAccessSchema({
                accessSchema: dropUpdates.accessSchema as { [key: string]: any; }[],
                creatorAddress: wallet?.address?.[0] as string,
              });

              await updateDrop({
                id: currentDrop?.id,
                accessSchemaId: id,
              });
            }
            const [drop] = await getDrops({
              id: currentDrop?.id,
            });

            const validator = new AccessValidator(drop?.accessSchema?.accessSchema || []);
            setCurrentDrop(drop);
            setDropUpdates({ accessSchema: validator.getAccessSchema() });
          }
        },
        2000,
      ));
    };

    saveDropUpdates();
  }, [dropUpdates]);

  useEffect(() => {
    const validator = new AccessValidator(currentDrop?.accessSchema?.accessSchema || []);
    setDropUpdates({ ...dropUpdates, accessSchema: validator.getAccessSchema() });
  }, []);

  return (
    <div style={{ margin: '3px 0px 0px 0px' }}>
      <Row className={style['form-wrapper']} style={{ margin: '0px' }}>
        {/* Tier Select */}
        <Col lg={5}>
          <Form.Label className={style['form-label']}>MEMBERSHIP TIER</Form.Label>
          <Dropdown>
            <Dropdown.Toggle
              style={{
                minWidth: '100%', textAlign: 'left', color: '#16434B', display: 'inline',
              }}
              variant="light"
              className={style['form-dropdown']}
            >
              {contractData?.tiers?.[dropUpdates?.tierId || currentDrop?.tierId || 0]?.name}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" style={{ minWidth: '100%', padding: '1px' }} className={style['form-dropdown']}>
              {contractData?.tiers?.map((tier: any, index: any) => (
                <Dropdown.Item
                  key={tier.name || index}
                  onClick={() => {
                    setDropUpdates({
                      ...dropUpdates,
                      tierId: tier.tierId,
                    });
                  }}
                >
                  {tier.name || `Tier ID: ${tier.id}`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className={style['form-wrapper']} style={{ margin: '3px 0px 0px 0px' }}>

        {/* Drop Name */}
        <Col lg={4}>
          <Form.Label className={style['form-label']}>DROP NAME (Optional)</Form.Label>
          <Form.Control
            className={style['form-input']}
            type="text"
            data-testid="dropName"
            value={(dropUpdates.name || currentDrop?.name || '')}
            onChange={(event) => {
              setDropUpdates({
                ...dropUpdates,
                name: event.target.value,
              });
            }}
          />
        </Col>

        {/* Start Time */}
        <Col lg={4}>
          <Form.Label className={style['form-label']}>MINTING OPENS</Form.Label>
          <Form.Control
            className={style['form-input']}
            type="datetime-local"
            data-testid="startTime"
            value={(dropUpdates.startTime || currentDrop?.startTime)?.slice(0, -1)}
            onChange={(event) => {
              setDropUpdates(
                {
                  ...dropUpdates,
                  startTime: new Date(event.target.value).toISOString(),
                },
              );
            }}
          />
        </Col>

        {/* End Time */}
        <Col lg={4}>
          <Form.Label className={style['form-label']}>MINTING CLOSES</Form.Label>
          <Form.Control
            className={style['form-input']}
            type="datetime-local"
            data-testid="endTime"
            value={(dropUpdates.endTime || currentDrop?.endTime)?.slice(0, -1)}
            onChange={(event) => {
              setDropUpdates(
                {
                  ...dropUpdates,
                  endTime: new Date(event.target.value).toISOString(),
                },
              );
            }}
          />
        </Col>
      </Row>

      <Row className={`${style['form-wrapper']} pt-4`} style={{ margin: '3px 0px 0px 0px' }}>
        <Col lg={12}>
          <span style={{ fontSize: '15px', fontWeight: 'bold', margin: '0px' }}>MINT RESTRICTIONS</span>
          <span style={{ fontSize: '14px', verticalAlign: 'bottom' }}>&emsp;Gate which accounts are eligible to mint from this drop</span>
          <hr style={{ margin: '8px 0px 8px 0px' }} />
        </Col>

        {(dropUpdates?.accessSchema && dropUpdates?.accessSchema.length > 0)
          ? (// AccessSchema is not empty
            <>
              <Col lg={12}>
                <Form.Label className={style['form-label']}>RULE</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle
                    data-testId="toggleRule"
                    style={{
                      minWidth: '100%', textAlign: 'left', color: '#16434B', display: 'inline',
                    }}
                    variant="light"
                    className={style['form-dropdown']}
                  >
                    {accessOperator === 'or' ? 'Minter must meet at least one requirement' : 'Minter must meet all requirements'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end" style={{ minWidth: '100%', padding: '1px' }} className={style['form-dropdown']}>
                    <Dropdown.Item
                      key="or"
                      onClick={() => {
                        if (dropUpdates?.accessSchema && dropUpdates?.accessSchema?.length > 1) {
                          const validator = new AccessValidator(dropUpdates?.accessSchema);
                          validator.updateAccessCondition({ index: 1, operator: 'or' });
                          setDropUpdates({
                            ...dropUpdates,
                            accessSchema: validator.getAccessSchema(),
                          });
                        }
                        setAccessOperator('or');
                      }}
                    >
                      Minter must meet at least one requirement
                    </Dropdown.Item>
                    <Dropdown.Item
                      key="and"
                      onClick={() => {
                        if (dropUpdates?.accessSchema && dropUpdates?.accessSchema?.length > 1) {
                          const validator = new AccessValidator(dropUpdates?.accessSchema);
                          validator.updateAccessCondition({ index: 1, operator: 'and' });
                          setDropUpdates({
                            ...dropUpdates,
                            accessSchema: validator.getAccessSchema(),
                          });
                        }
                        setAccessOperator('and');
                      }}
                    >
                      Minter must meet all requirements
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Row className="mx-0 px-0" style={{ maxHeight: '250px', overflow: 'auto', marginTop: '10px' }}>
                {dropUpdates?.accessSchema?.map((accessCondition:{ [key: string]: any }, index) => (
                  <SchemaContainer index={index} />
                ))}
              </Row>
            </>
          )
          : (// AccessSchema does not exist or is empty
            <Row className="mx-0 px-0">
              <Col className="text-center" lg={12}>
                <div style={{
                  fontWeight: 'bold',
                  backgroundColor: '#F5F5F5',
                  padding: '40px 20px 40px 20px',
                  marginTop: '10px',
                  border: '1px solid #D5D5D5',
                  borderRadius: '0.25rem',
                }}
                >
                  No restrictions
                </div>
              </Col>
            </Row>
          )}

        <Col lg={12} className="text-center">
          <Button
            style={{ marginTop: '10px' }}
            className={projectStyle['add-whitelist-record']}
            onClick={async () => {
              const validator = new AccessValidator(dropUpdates.accessSchema);

              validator?.addAccessCondition(
                { key: 'hasBalance', chainId: parseInt(contractData?.chainId, 10), minBalance: 1 },
                accessOperator,
              );

              setDropUpdates({
                ...dropUpdates,
                accessSchema: validator.getAccessSchema(),
              });
            }}
          >
            <PlusCircleFill size={20} className={projectStyle['add-whitelist-icon']} />
            ADD REQUIREMENT
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ConfigureDrop;
