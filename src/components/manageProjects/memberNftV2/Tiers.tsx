/* eslint-disable react/jsx-props-no-spreading, no-nested-ternary */
import React, { useState } from 'react';
import {
  Container, Row, Col, Form, Button, Dropdown, InputGroup, Card,
} from 'react-bootstrap';
import { useRecoilValue, useRecoilValueLoadable, useRecoilState } from 'recoil';
import {
  XCircleFill, Plus, Pencil, XCircle,
} from 'react-bootstrap-icons';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import { useDropzone } from 'react-dropzone';
import style from '../../../styles/deploy.module.css';
import manageStyle from '../../../styles/manageProjects.module.css';
import Tooltip from '../../shared/Tooltip';
import networks from '../../../constants/networks';
import { contractsWithMetadataState, selectedContractState } from '../../../state/contract';
import { nftContractUpdates } from '../../../state/nftContract';
import { ContractWithMetadata } from '../../../interfaces/contract';
import config from '../../../config';
import placeholder from '../../../images/dashboard/placeholder.png';
import { Tier } from '../../../interfaces/nft';

const castNetworks = networks as any;

// Child component rendering tier image or upload dropzone
function TierImage({ tierIndex }:{tierIndex:number}) {
  const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectId);
  const [contractUpdates, setContractUpdates] = useRecoilState(nftContractUpdates);
  const [updateImage, setUpdateImage] = useState(false);

  // Configure dropzone hook
  const { getRootProps: getRootPropsImage, getInputProps: getInputPropsImage } = useDropzone({
    maxFiles: 1,
    accept: '.jpg,.jpeg,.png,.gif',
    onDrop: (files) => {
      setContractUpdates({
        ...contractUpdates,
        tiers: contractUpdates?.tiers?.map((tier, index) => {
          if (index === tierIndex) {
            return {
              ...tier,
              image: files[0],
            };
          }
          return tier;
        }),
      });
      setUpdateImage(!updateImage);
    },
  });

  // Render image upload box
  if (updateImage) {
    return (
      <div data-testid="dropzone" {...getRootPropsImage({ style: { position: 'relative' } })}>
        <Card className={manageStyle['file-upload']}>
          CLICK TO SELECT A FILE...
        </Card>
        <input data-testid="image" {...getInputPropsImage()} />
        <XCircle
          size={24}
          className={manageStyle['sidebar-icon']}
          style={{ top: '86%' }}
          onClick={(event) => {
            setUpdateImage(!updateImage);
            event.stopPropagation();
          }}
        />
      </div>
    );
  }

  // Render image or placeholder
  return (
    <div style={{ position: 'relative' }}>
      <img
        data-testid="image"
        className={manageStyle['sidebar-image']}
        src={typeof contractUpdates?.tiers?.[tierIndex]?.image === 'string' ? ipfs.getGatewayUrl(contractUpdates?.tiers?.[tierIndex]?.image as string)
          : (contractUpdates?.tiers?.[tierIndex]?.image ? URL.createObjectURL(contractUpdates?.tiers?.[tierIndex]?.image as Blob)
            : placeholder)}
        alt={placeholder}
      />

      {/* Pencil icon activates new image upload on click */}
      <Pencil
        data-testid="updateImage"
        size={24}
        style={{ backgroundColor: 'transparent' }}
        className={manageStyle['sidebar-icon']}
        onClick={() => {
          setContractUpdates({
            ...contractUpdates,
            tiers: contractUpdates?.tiers?.map((tier, index) => {
              if (index === tierIndex) {
                return {
                  ...tier,
                  image: null,
                };
              }
              return tier;
            }),
          });
          setUpdateImage(true);
        }}
      />
    </div>
  );
}

// Main component rendering all tier fields
function Tiers() {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address } = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string] as ContractWithMetadata;

  const [contractUpdates, setContractUpdates] = useRecoilState(nftContractUpdates);
  const [currentTierIndex, setCurrentTierIndex] = useState(0);

  // No tiers exist yet
  if (!contractUpdates?.tiers?.length) {
    return (
      <Container className={style['template-wrapper']}>
        <Row style={{ margin: '0px' }} className={style['form-wrapper']}>
          <Col className="text-center">
            {/* No tiers created message */}
            {contractsWithMetadata.state === 'hasValue' ? (<p style={{ marginTop: '20px' }} className={manageStyle['metrics-title']}>No tiers created yet</p>) : null}

            {/* Add a tier button */}
            <Button
              style={{ margin: '20px 0px 20px 0px', borderRadius: '5px', textAlign: 'center' }}
              className={style['role-tab-inactive']}
              key="firstTier"
              data-testid="addFirstTier"
              onClick={() => {
                setContractUpdates({
                  ...contractUpdates,
                  tiers: [
                    {
                      tierId: 0,
                      royaltyBasis: 0,
                      salePrice: 0,
                      isTransferable: false,
                      name: '',
                      description: '',
                    }],
                });
                setCurrentTierIndex(0);
              }}
            >
              <Plus style={{ verticalAlign: 'top' }} size={24} />
              <span style={{ display: 'inline-block', marginTop: '2px' }}>Add a Tier</span>
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  // Some Tiers already exist
  return (
    <Container className={style['template-wrapper']}>
      <Row>
        <Col>
          {/* Tiers dropdown */}
          <Dropdown>
            <Dropdown.Toggle className={style['role-tab']}>
              {contractUpdates?.tiers?.[currentTierIndex]?.name || 'Unnamed Tier'}
            </Dropdown.Toggle>

            <Dropdown.Menu
              style={{ minWidth: '170px' }}
            >
              {contractUpdates?.tiers?.map((tier: Tier, index: any) => (
                <Dropdown.Item
                  key={tier.name || index}
                  className={style['role-option']}
                  onClick={() => {
                    setCurrentTierIndex(index);
                  }}
                >
                  {tier.name || 'Unnamed Tier'}
                  {index >= (contractData?.tiers?.length as number) ? (
                    <XCircleFill
                      data-testid="removeTier"
                      className={style['cancel-icon']}
                      style={{ float: 'right' }}
                      size={20}
                      onClick={(event) => {
                        event.stopPropagation();
                        const newTiers: Tier[] = [];

                        contractUpdates.tiers?.forEach((cancelTier: any, cancelIndex: any) => {
                          if (index !== cancelIndex) newTiers.push(cancelTier);
                        });

                        if (index >= newTiers.length) setCurrentTierIndex(newTiers.length - 1);

                        else if (index === currentTierIndex) setCurrentTierIndex(index - 1);

                        else if (index === 0) setCurrentTierIndex(0);

                        setContractUpdates({
                          ...contractUpdates,
                          tiers: newTiers,
                        });
                      }}
                    />
                  ) : null}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Add Tier Button */}
          <Button
            className={style['role-tab-inactive']}
            data-testid="addTier"
            onClick={() => {
              setContractUpdates({
                ...contractUpdates,
                tiers: [
                  ...(contractUpdates?.tiers || []),
                  {
                    tierId: contractUpdates?.tiers?.length as number,
                    royaltyBasis: 0,
                    salePrice: 0,
                    isTransferable: false,
                    name: '',
                    description: '',
                  }],
              });
              setCurrentTierIndex(contractUpdates?.tiers?.length as number);
            }}
          >
            <Plus style={{ verticalAlign: 'bottom' }} size={24} />
            Add Tier
          </Button>
        </Col>
      </Row>

      {/* Tier Image */}
      <Row style={{ margin: '0px' }} className={style['form-wrapper']}>
        <Col lg={4}>
          <div>
            <Form.Label className={style['form-label']}>TIER IMAGE</Form.Label>
            <Form.Label style={{ fontWeight: 'normal' }} className={style['form-label']}>Optionally upload an image to represent this membership tier</Form.Label>
            <TierImage tierIndex={currentTierIndex} />
          </div>
        </Col>

        {/* Text fields */}
        <Col>
          <Row>
            {/* Tier ID */}
            <Col lg={3}>
              <Form.Label className={style['form-label']}>TIER ID</Form.Label>
              <Form.Control
                style={{ backgroundColor: '#D9D9D9' }}
                className={style['form-input']}
                type="text"
                data-testid="id"
                value={contractUpdates?.tiers?.[currentTierIndex]?.tierId}
                readOnly
              />
            </Col>

            {/* Tier Name */}
            <Col>
              <Form.Label className={style['form-label']}>TIER NAME</Form.Label>
              <Form.Control
                className={style['form-input']}
                type="text"
                data-testid="name"
                value={contractUpdates?.tiers?.[currentTierIndex]?.name}
                onChange={(event) => {
                  setContractUpdates({
                    ...contractUpdates,
                    tiers: contractUpdates?.tiers?.map((tier, index) => {
                      if (index === currentTierIndex) {
                        return {
                          ...tier,
                          name: event.target.value,
                        };
                      }
                      return tier;
                    }),
                  });
                }}
              />
            </Col>
          </Row>

          {/* Tier Description */}
          <Row>
            <Col>
              <Form.Label style={{ marginTop: '18px' }} className={style['form-label']}>DESCRIPTION</Form.Label>
              <Tooltip className={style.tooltip} header="Role Description" body="Describe the purpose of this role within your community, what makes it special, and why someone would want this NFT." />
              <Form.Control
                className={style['form-input']}
                as="textarea"
                rows={3}
                data-testid="description"
                value={contractUpdates?.tiers?.[currentTierIndex]?.description}
                onChange={(event) => {
                  setContractUpdates({
                    ...contractUpdates,
                    tiers: contractUpdates?.tiers?.map((tier, index) => {
                      if (index === currentTierIndex) {
                        return {
                          ...tier,
                          description: event.target.value,
                        };
                      }
                      return tier;
                    }),
                  });
                }}
              />
            </Col>
          </Row>

          <Row>
            {/* Tier Sale Price */}
            <Col lg={7}>
              <Form.Label style={{ marginTop: '18px' }} className={style['form-label']}>{`MINT PRICE (${castNetworks[contractData?.chainId as string]?.token})`}</Form.Label>
              <Form.Control
                className={style['form-input']}
                type="number"
                min={0}
                data-testid="price"
                value={contractUpdates?.tiers?.[currentTierIndex]?.salePrice}
                onChange={(event) => {
                  setContractUpdates({
                    ...contractUpdates,
                    tiers: contractUpdates?.tiers?.map((tier, index) => {
                      if (index === currentTierIndex) {
                        return {
                          ...tier,
                          salePrice: parseFloat(event.target.value) || 0,
                        };
                      }
                      return tier;
                    }),
                  });
                }}
              />
            </Col>

            {/* Tier Royalties */}
            <Col lg={5}>
              <Form.Label style={{ marginTop: '18px' }} className={style['form-label']}>ROYALTY ON SECONDARY SALES</Form.Label>
              <InputGroup className="mb-2">
                <InputGroup.Text
                  style={{ borderRadius: '5px 0px 0px 5px', color: '#16434B', fontSize: '14px' }}
                  className={style['form-input']}
                >
                  %
                </InputGroup.Text>
                <Form.Control
                  data-testid="royalty"
                  className={style['form-input']}
                  type="number"
                  min={0}
                  value={(contractUpdates?.tiers?.[currentTierIndex]?.royaltyBasis || 0) / 100}
                  onChange={(event) => {
                    setContractUpdates({
                      ...contractUpdates,
                      tiers: contractUpdates?.tiers?.map((tier, index) => {
                        if (index === currentTierIndex) {
                          return {
                            ...tier,
                            royaltyBasis: (parseFloat(event.target.value) || 0) * 100,
                          };
                        }
                        return tier;
                      }),
                    });
                  }}
                />
              </InputGroup>
            </Col>
          </Row>

          {/* isTransferable */}
          <Row>
            <Col style={{ marginTop: '18px' }}>
              <Form.Check>
                <Form.Check.Input
                  data-testid="transferable"
                  style={{ marginTop: '7px' }}
                  type="checkbox"
                  checked={contractUpdates?.tiers?.[currentTierIndex]?.isTransferable}
                  onChange={() => {
                    const currentState = contractUpdates?.tiers?.[currentTierIndex]?.isTransferable;
                    setContractUpdates({
                      ...contractUpdates,
                      tiers: contractUpdates?.tiers?.map((tier, index) => {
                        if (index === currentTierIndex) {
                          return {
                            ...tier,
                            isTransferable: !currentState,
                          };
                        }
                        return tier;
                      }),
                    });
                  }}
                />
                <Form.Check.Label />
                <span style={{ fontSize: '13px' }} className={style['form-label']}>TRANSFERABLE</span>
              </Form.Check>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Tiers;
