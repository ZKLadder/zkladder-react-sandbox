import React, { useEffect, useState } from 'react';
import {
  Col, Dropdown, Form, Row,
} from 'react-bootstrap';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import style from '../../../../styles/deploy.module.css';
import { contractsWithMetadataState, selectedContractState } from '../../../../state/contract';
import { ContractWithMetadata } from '../../../../interfaces/contract';
import { currentDropState } from '../../../../state/page';
import { getDrops, updateDrop } from '../../../../utils/api';

function ConfigureDrop() {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address } = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string] as ContractWithMetadata;
  const [currentDrop, setCurrentDrop] = useRecoilState(currentDropState);

  const [dropUpdates, setDropUpdates] = useState({}) as any;

  const [timeout, persistTimeout] = useState(0);

  // UseEffect to persist all updates to backend in realtime
  useEffect(() => {
    const saveDropUpdates = async () => {
      window.clearTimeout(timeout);

      persistTimeout(window.setTimeout(
        async () => {
          await updateDrop({
            id: currentDrop?.id,
            ...dropUpdates,
          });

          const [drop] = await getDrops({
            id: currentDrop?.id,
          });

          setCurrentDrop(drop);
          setDropUpdates({});
        },
        2000,
      ));
    };

    if (Object.keys(dropUpdates).length > 0) saveDropUpdates();
  }, [dropUpdates]);

  return (
    <div style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
      <Row>
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
              {contractData?.tiers?.[dropUpdates.tierId || currentDrop?.tierId]?.name}
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
        <Col lg={12}><hr /></Col>
      </Row>
      <Row>

        {/* Drop Name */}
        <Col lg={4}>
          <Form.Label className={style['form-label']}>DROP NAME (Optional)</Form.Label>
          <Form.Control
            className={style['form-input']}
            type="text"
            data-testid="dropName"
            value={(dropUpdates.name || currentDrop?.name)}
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
        <Col lg={12}><hr /></Col>
      </Row>
    </div>
  );
}

export default ConfigureDrop;
