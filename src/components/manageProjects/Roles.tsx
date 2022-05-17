/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Form, Button, Dropdown,
} from 'react-bootstrap';
import { useRecoilValue, useRecoilValueLoadable, useRecoilState } from 'recoil';
import { XCircleFill, Plus } from 'react-bootstrap-icons';
import style from '../../styles/deploy.module.css';
import Tooltip from '../shared/Tooltip';
import networks from '../../constants/networks';
import { contractsWithMetadataState, selectedContractState } from '../../state/contract';
import { nftContractUpdates } from '../../state/nftContract';
import { ContractWithMetadata } from '../../interfaces/contract';
import { MemberNftRole } from '../../interfaces/deploy';

const castNetworks = networks as any;

function Roles() {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const address = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string] as ContractWithMetadata;

  const [contractUpdates, setContractUpdates] = useRecoilState(nftContractUpdates);

  const [error, setError] = useState() as any;
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    if (contractUpdates?.errors) {
      setError(contractUpdates?.errors?.roleError);
      setCurrentRoleIndex(contractUpdates?.errors?.roleIndex);
    }
  }, [contractUpdates]);

  return (
    <Container className={style['template-wrapper']}>
      <Row>
        <Col>
          {/* Roles dropdown */}
          <Dropdown>
            <Dropdown.Toggle className={style['role-tab']}>
              {contractUpdates?.roles?.[currentRoleIndex]?.name || 'Unnamed Role'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {contractUpdates?.roles?.map((role: any, index: any) => {
                let newRoles: any[] = [];
                return (
                  <Dropdown.Item
                    key={role.name || index}
                    className={style['role-option']}
                    onClick={() => {
                      setCurrentRoleIndex(index);
                    }}
                  >
                    {role.name || 'Unnamed Role'}
                    <XCircleFill
                      data-testid="removeImage"
                      className={style['cancel-icon']}
                      style={{ float: 'right' }}
                      size={20}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (contractUpdates?.roles?.length as number > 1) {
                          newRoles = [];

                          contractUpdates.roles?.forEach((cancelRole: any, cancelIndex: any) => {
                            if (index !== cancelIndex) newRoles.push(cancelRole);
                          });

                          if (index >= newRoles.length) setCurrentRoleIndex(newRoles.length - 1);

                          setContractUpdates({
                            ...contractUpdates,
                            roles: newRoles,
                          });
                        } else {
                          setError('Must include at least one role with a name and ID');
                        }
                      }}
                    />
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>

          {/* Add Role Button */}
          <Button
            className={style['role-tab-inactive']}
            data-testid="addRole"
            onClick={() => {
              setError(undefined);
              setContractUpdates({
                ...contractUpdates,
                roles: [
                  ...(contractUpdates?.roles || []),
                  {
                    name: '',
                    id: '',
                    description: '',
                    price: 0,
                  }],
              });
              setCurrentRoleIndex((contractUpdates?.roles as MemberNftRole[]).length);
            }}
          >
            <Plus style={{ verticalAlign: 'bottom' }} size={24} />
            Add Role
          </Button>
          <span className={style.feedback}>{error}</span>
        </Col>
      </Row>

      {/* Role Name */}
      <Row style={{ margin: '0px' }} className={style['form-wrapper']}>
        <Col lg={7}>
          <Form.Label className={style['form-label']}>ROLE NAME</Form.Label>
          <Form.Control
            className={style['form-input']}
            type="text"
            data-testid="name"
            value={contractUpdates?.roles?.[currentRoleIndex]?.name}
            onChange={(event) => {
              setContractUpdates({
                ...contractUpdates,
                roles: contractUpdates?.roles?.map((role, index) => {
                  if (index === currentRoleIndex) {
                    const id = (!role.id || role.id === role.name) ? event.target.value : role.id;
                    return {
                      ...role,
                      name: event.target.value,
                      id,
                    };
                  }
                  return role;
                }),
              });
            }}
          />
        </Col>

        {/* Role ID */}
        <Col>
          <Form.Label className={style['form-label']}>ROLE ID</Form.Label>
          <Form.Control
            className={style['form-input']}
            type="text"
            data-testid="id"
            value={contractUpdates?.roles?.[currentRoleIndex]?.id || contractUpdates?.roles?.[currentRoleIndex]?.name}
            onChange={(event) => {
              setContractUpdates({
                ...contractUpdates,
                roles: contractUpdates?.roles?.map((role, index) => {
                  if (index === currentRoleIndex) {
                    return {
                      ...role,
                      id: event.target.value,
                    };
                  }
                  return role;
                }),
              });
            }}
          />
        </Col>

        {/* Role Price */}
        <Col>
          <Form.Label className={style['form-label']}>{`MINT PRICE (${castNetworks[contractData?.chainId as string]?.token})`}</Form.Label>
          <Form.Control
            className={style['form-input']}
            type="number"
            step="0.1"
            min="0"
            data-testid="price"
            value={contractUpdates?.roles?.[currentRoleIndex]?.price}
            onChange={(event) => {
              setContractUpdates({
                ...contractUpdates,
                roles: contractUpdates?.roles?.map((role, index) => {
                  if (index === currentRoleIndex) {
                    return {
                      ...role,
                      price: parseFloat(event.target.value),
                    };
                  }
                  return role;
                }),
              });
            }}
          />
        </Col>
      </Row>

      {/* Role Description */}
      <Row style={{ margin: '3px 0px 0px 0px' }} className={style['form-wrapper']}>
        <Col>
          <Form.Label className={style['form-label']}>DESCRIPTION</Form.Label>
          <Tooltip className={style.tooltip} header="Role Description" body="Describe the purpose of this role within your community, what makes it special, and why someone would want this NFT." />
          <Form.Control
            className={style['form-input']}
            as="textarea"
            rows={3}
            data-testid="description"
            value={contractUpdates?.roles?.[currentRoleIndex]?.description}
            onChange={(event) => {
              setContractUpdates({
                ...contractUpdates,
                roles: contractUpdates?.roles?.map((role, index) => {
                  if (index === currentRoleIndex) {
                    return {
                      ...role,
                      description: event.target.value,
                    };
                  }
                  return role;
                }),
              });
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Roles;
