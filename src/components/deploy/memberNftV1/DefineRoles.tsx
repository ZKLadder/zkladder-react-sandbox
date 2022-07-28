/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import {
  Container, Row, Col, Form, Button, Dropdown,
} from 'react-bootstrap';
import { useRecoilState, useRecoilValue } from 'recoil';
import { XCircleFill, Plus } from 'react-bootstrap-icons';
import { deployState } from '../../../state/deploy';
import style from '../../../styles/deploy.module.css';
import sharedStyle from '../../../styles/shared.module.css';
import Tooltip from '../../shared/Tooltip';
import { walletState } from '../../../state/wallet';
import networks from '../../../constants/networks';

const castNetworks = networks as any;

function DefineRoles() {
  const { chainId } = useRecoilValue(walletState);
  const [deploy, setDeployState] = useRecoilState(deployState);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [error, setError] = useState() as any;

  const hasMissingFields = () => {
    let missingFields = false;
    deploy.roles?.forEach((role, index) => {
      if (!role.name) {
        setError(`Role #${index + 1} is missing a name`);
        missingFields = true;
      } else if (!role.id) {
        setError(`Role #${index + 1} is missing an ID`);
        missingFields = true;
      }
    });
    return missingFields;
  };

  return (
    <Container className={sharedStyle['body-wrapper']}>
      <p className={style.title}>
        DEFINE COMMUNITY ROLES
      </p>
      <p className={style.description}>
        Here you can define the various tiers/roles within your NFT community.
        This will enable you to build tailored workflows and offer NFTs for
        with varying levels of access and benefits from a single contract address.
        Once these fields are set, it will cost gas to update them.
      </p>
      <Col>
        {/* Roles dropdown */}
        <Dropdown>
          <Dropdown.Toggle className={style['role-tab']}>
            {deploy.roles?.[currentRoleIndex]?.name || 'Unnamed Role'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {deploy.roles?.map((role, index) => {
              let newRoles:any[] = [];
              return (
                <Dropdown.Item
                  key={role.name || 'Unnamed Role'}
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
                    onClick={async () => {
                      if ((deploy.roles?.length as number) > 1) {
                        newRoles = [];

                        deploy.roles?.forEach((cancelRole, cancelIndex) => {
                          if (index !== cancelIndex) newRoles.push(cancelRole);
                        });

                        setDeployState({
                          ...deploy,
                          roles: newRoles,
                        });
                        setTimeout(() => { if (index >= newRoles.length) setCurrentRoleIndex(index - 1); }, 3);
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

        {/* Add role button */}
        <Button
          className={style['role-tab-inactive']}
          data-testid="addRole"
          onClick={() => {
            setError(undefined);
            deploy.roles?.push({
              name: '',
              id: '',
              description: '',
              price: 0,
            });
            setCurrentRoleIndex((deploy.roles?.length as number) - 1);
          }}
        >
          <Plus style={{ verticalAlign: 'bottom' }} size={24} />
          Add Role
        </Button>
        <span className={style.feedback}>{error}</span>
      </Col>
      <Row className={style['template-wrapper']}>

        {/* Role name field */}
        <Col lg={8}>
          <div className={style['form-wrapper']}>
            <Row>
              <Col lg={7}>
                <Form.Label className={style['form-label']}>ROLE NAME</Form.Label>
                <Tooltip className={style.tooltip} header="Role Name" body="Specify the name of this role within your community. IE: 'Admin' or 'Moderator'. You can also specify tiers of membership like 'Gold' or 'Silver'" />
                <Form.Control
                  className={style['form-input']}
                  type="text"
                  data-testid="name"
                  value={deploy.roles?.[currentRoleIndex]?.name}
                  onChange={(event) => {
                    setDeployState({
                      ...deploy,
                      roles: deploy.roles?.map((role, index) => {
                        if (index === currentRoleIndex && (!role.id || role.id === role.name)) role.id = event.target.value;
                        if (index === currentRoleIndex) role.name = event.target.value;
                        return role;
                      }),
                    });
                  }}
                />
              </Col>

              {/* Role ID field */}
              <Col>
                <Form.Label className={style['form-label']}>ROLE ID</Form.Label>
                <Tooltip className={style.tooltip} header="Role ID String" body="Optionally specify a unique ID for this role. Defaults to role name." />
                <Form.Control
                  className={style['form-input']}
                  type="text"
                  data-testid="id"
                  value={deploy.roles?.[currentRoleIndex]?.id || deploy.roles?.[currentRoleIndex]?.name}
                  onChange={(event) => {
                    setDeployState({
                      ...deploy,
                      roles: deploy.roles?.map((role, index) => {
                        if (index === currentRoleIndex) role.id = event.target.value;
                        return role;
                      }),
                    });
                  }}
                />
              </Col>
            </Row>

            {/* Role Description field */}
            <Row>
              <Col style={{ marginTop: '18px' }}>
                <Form.Label style={{ marginTop: '18px' }} className={style['form-label']}>ROLE DESCRIPTION</Form.Label>
                <Tooltip className={style.tooltip} header="Role Description" body="Describe the purpose of this role within your community, what makes it special, and why someone would want this NFT." />
                <Form.Control
                  className={style['form-input']}
                  as="textarea"
                  rows={3}
                  data-testid="description"
                  value={deploy.roles?.[currentRoleIndex]?.description}
                  onChange={(event) => {
                    setDeployState({
                      ...deploy,
                      roles: deploy.roles?.map((role, index) => {
                        if (index === currentRoleIndex) role.description = event.target.value;
                        return role;
                      }),
                    });
                  }}
                />
              </Col>
            </Row>
          </div>
        </Col>

        {/* Role Price field */}
        <Col>
          <div className={style['form-wrapper']}>
            <Row>
              <Col>
                <Form.Label className={style['form-label']}>{`MINT PRICE (${castNetworks[chainId as number].token})`}</Form.Label>
                <Tooltip className={style.tooltip} header="Mint Price for this Role/Tier" body="Specify how much it will cost for users to mint this NFT tier. Leave blank to make this NFT free." />
                <Form.Control
                  className={style['form-input']}
                  type="number"
                  step="0.1"
                  min="0"
                  data-testid="price"
                  value={deploy.roles?.[currentRoleIndex]?.price}
                  onChange={(event) => {
                    setDeployState({
                      ...deploy,
                      roles: deploy.roles?.map((role, index) => {
                        if (index === currentRoleIndex) role.price = parseFloat(event.target.value);
                        return role;
                      }),
                    });
                  }}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Continue and Return buttons */}
      <Row>
        <Col xs={6}>
          <Button
            className={style['continue-button']}
            data-testid="continue"
            onClick={() => {
              if (!hasMissingFields()) {
                setDeployState({
                  ...deploy,
                  currentStep: 4,
                });
              }
            }}
          >
            CONTINUE
          </Button>
        </Col>
        <Col>
          <Button
            className={style['return-button']}
            onClick={() => {
              setDeployState({
                ...deploy,
                currentStep: 2,
              });
            }}
          >
            RETURN TO CONTRACT CONFIGURATION
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default DefineRoles;
