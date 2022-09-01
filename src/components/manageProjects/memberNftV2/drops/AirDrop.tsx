/* eslint-disable jsx-a11y/click-events-have-key-events, react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Row, Col, Dropdown, Form, InputGroup, Card, Collapse, Button,
} from 'react-bootstrap';
import {
  useSetRecoilState, useRecoilValue, useRecoilValueLoadable, useRecoilRefresher_UNSTABLE as useRecoilRefresherUnstable,
} from 'recoil';
import { Box, XCircleFill } from 'react-bootstrap-icons';
import { useDropzone } from 'react-dropzone';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import style from '../../../../styles/deploy.module.css';
import projectStyle from '../../../../styles/manageProjects.module.css';
import { contractsWithMetadataState, selectedContractState, writableContractState } from '../../../../state/contract';
import {
  dropSectionState, errorState, loadingState, manageProjectsPageState,
} from '../../../../state/page';
import { ContractWithMetadata } from '../../../../interfaces/contract';
import { NftMintParams } from '../../../../interfaces/nft';
import Tooltip from '../../../shared/Tooltip';
import config from '../../../../config';
import { shortenAddress } from '../../../../utils/helpers';
import { walletState } from '../../../../state/wallet';

function AirDrop() {
  const setDropSection = useSetRecoilState(dropSectionState);
  const setManageProjectsSection = useSetRecoilState(manageProjectsPageState);
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address } = useRecoilValue(selectedContractState);
  const { chainId } = useRecoilValue(walletState);
  const contractData = contractsWithMetadata?.contents?.[address as string] as ContractWithMetadata;
  const memberNft = useRecoilValueLoadable(writableContractState)?.contents;
  const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectSecret);

  const [newNft, setNewNft] = useState({ tierId: 0, userAddress: '', metadata: {} } as NftMintParams);

  const [newTrait, setNewTrait] = useState({ trait_type: '', value: '' });

  const [missingFields, setMissingFields] = useState({} as any);

  const setTransactionLoading = useSetRecoilState(loadingState);
  const setError = useSetRecoilState(errorState);

  const refresh = useRecoilRefresherUnstable(contractsWithMetadataState);

  const hasMissingFields = () => {
    const errors:any = {};

    if (!newNft.userAddress) errors.userAddress = 'Required field';

    if (Object.keys(errors).length > 0) {
      setMissingFields(errors);
      return true;
    }
    return false;
  };

  const { getRootProps: getRootPropsImage, getInputProps: getInputPropsImage } = useDropzone({
    maxFiles: 1,
    accept: '.jpg,.jpeg,.png,.gif',
    onDrop: (files) => {
      setNewNft({
        ...newNft,
        metadata: { ...newNft.metadata, image: files[0] },
      });
    },
  });

  // At least membership one tier already created
  return (
    <Row
      className={`${style['form-wrapper']} mx-0 px-0 py-4`}
      style={{ margin: '3px 0px 0px 0px' }}
    >
      {/* Description */}
      <Col lg={12}>
        <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
          Airdrop an NFT to one of your end users - covering the gast cost yourself.
          <span
            role="button"
            tabIndex={0}
            style={{ color: '#4EB9B1', marginTop: '2px' }}
            className={projectStyle['switch-chain-notice']}
            onClick={() => { setDropSection('dropTable'); }}
          >
            CANCEL
          </span>
        </p>
        <hr />
      </Col>

      {/* Tier Data Section */}
      <Row className="mx-0 px-0 pt-1">
        <Col lg={4}>
          <Form.Label className={style['form-label']}>MEMBERSHIP TIER </Form.Label>
          <Dropdown>
            <Dropdown.Toggle
              style={{
                minWidth: '100%', textAlign: 'left', color: '#16434B', display: 'inline',
              }}
              variant="light"
              className={style['form-dropdown']}
            >
              {contractData?.tiers?.[newNft.tierId]?.name}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" style={{ minWidth: '100%', padding: '1px' }} className={style['form-dropdown']}>
              {contractData?.tiers?.map((tier: any, index: any) => (
                <Dropdown.Item
                  key={tier.name || index}
                  onClick={() => {
                    setNewNft({
                      ...newNft,
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
        <Col lg={4}>
          <Form.Label className={style['form-label']}>ROYALTIES</Form.Label>
          <InputGroup>
            <InputGroup.Text
              style={{
                borderRadius: '5px 0px 0px 5px', color: '#16434B', fontSize: '14px', backgroundColor: '#D9D9D9',
              }}
              className={style['form-input']}
            >
              %
            </InputGroup.Text>
            <Form.Control
              style={{ backgroundColor: '#D9D9D9' }}
              className={style['form-input']}
              type="text"
              value={(contractData?.tiers?.[newNft.tierId]?.royaltyBasis || 0) / 100}
              readOnly
            />
          </InputGroup>
        </Col>
        <Col lg={4}>
          <Form.Label className={style['form-label']}>TRANSFERABILITY</Form.Label>
          <Form.Control
            style={{ backgroundColor: '#D9D9D9' }}
            className={style['form-input']}
            type="text"
            value={contractData?.tiers?.[newNft.tierId]?.isTransferable ? 'Transferable' : 'Non-Transferable'}
            readOnly
          />
        </Col>
      </Row>

      {/* Holder Address Input */}
      <Col className="pt-2 py-1" lg={12}>
        <hr />
        <Form.Label className={style['form-label']}>HOLDER ADDRESS (Required)</Form.Label>
        <Tooltip className={style.tooltip} header="Holder Address" body="Input the address which should recieve the newly minted NFT" />
        <Form.Control
          style={{ maxWidth: '45%' }}
          className={style['form-input']}
          type="text"
          value={newNft.userAddress}
          isInvalid={missingFields.userAddress}
          data-testid="userAddress"
          onChange={(event) => {
            setNewNft({
              ...newNft,
              userAddress: event.target.value,
            });
          }}
        />
        <hr style={{ marginTop: '22px' }} />
      </Col>

      <Row className="mx-0 px-0">
        <Col lg={8}>
          <Row>

            {/* NFT Name Input */}
            <Col className="pb-2" lg={10}>
              <Form.Label className={style['form-label']}>NFT NAME</Form.Label>
              <Form.Control
                className={style['form-input']}
                type="text"
                value={newNft.metadata.name}
                data-testid="nftName"
                onChange={(event) => {
                  setNewNft({
                    ...newNft,
                    metadata: {
                      ...newNft.metadata,
                      name: event.target.value,
                    },
                  });
                }}
              />
            </Col>

            {/* NFT Description Input */}
            <Col className="pb-2" lg={10}>
              <Form.Label className={style['form-label']}>NFT DESCRIPTION</Form.Label>
              <Form.Control
                className={style['form-input']}
                as="textarea"
                rows={4}
                value={newNft.metadata.description}
                data-testid="nftDescription"
                onChange={(event) => {
                  setNewNft({
                    ...newNft,
                    metadata: {
                      ...newNft.metadata,
                      description: event.target.value,
                    },
                  });
                }}
              />
            </Col>
          </Row>
        </Col>

        {/* NFT Image Input */}
        <Col className="pb-3" lg={4}>
          <Form.Label className={style['form-label']}>NFT IMAGE</Form.Label>
          {newNft.metadata.image
            ? (
              <div style={{ height: '20vh' }}>
                {/* Image preview */}
                <img data-testid="imagePreview" alt={newNft.metadata.name} className={style['image-preview']} src={URL.createObjectURL(newNft.metadata.image as File)} />
                <XCircleFill
                  data-testid="removeImage"
                  className={style['cancel-icon-image']}
                  style={{ top: '85%', right: '30px' }}
                  size={28}
                  onClick={async () => {
                    setNewNft({
                      ...newNft,
                      metadata: { ...newNft.metadata, image: undefined },
                    });
                  }}
                />
              </div>
            )
            : (
              <div data-testid="dropzone" {...getRootPropsImage({ style: { height: '93%' } })}>
                {/* Image dropzone */}
                <Card className={style['file-upload']}>
                  DRAG AND DROP OR CLICK TO SELECT A FILE
                </Card>
                <input data-testid="image" {...getInputPropsImage()} />
              </div>
            )}
        </Col>

        {/* Add Attributes Checkbox */}
        <Col lg={12}>
          <hr style={{ marginBottom: '20px' }} />
          <Form.Check
            style={{ fontSize: '14px' }}
            checked={!!(newNft.metadata.attributes)}
            className={style['form-label']}
            type="switch"
            data-testid="attributesCheck"
            label={(
              <span style={{ display: 'inline-block', verticalAlign: 'bottom' }}>
                ADD ATTRIBUTES (see the
                {' '}
                <a style={{ color: '#4EB9B1' }} href="https://docs.opensea.io/docs/metadata-standards" target="_blank" rel="noreferrer">OpenSea Metadata Standards</a>
                )
              </span>
                  )}
            onChange={() => {
              setNewNft({
                ...newNft,
                metadata: {
                  ...newNft.metadata,
                  attributes: newNft.metadata.attributes ? undefined : [],
                },
              });
            }}
          />
        </Col>

        {/* Attributes Section */}
        <Col lg={12}>
          <Collapse in={!!(newNft.metadata.attributes)}>
            <Row className="mx-0 px-0">

              {/* Trait Type Input */}
              <Col className=" px-0 mt-2" lg={4}>
                <Form.Label className={style['form-label']}>TRAIT TYPE</Form.Label>
                <Form.Control
                  className={style['form-input']}
                  type="text"
                  value={newTrait.trait_type}
                  data-testid="traitType"
                  onChange={(event) => {
                    setNewTrait({
                      ...newTrait,
                      trait_type: event.target.value,
                    });
                  }}
                />

                {/* Trait Value Input */}
                <Form.Label style={{ marginTop: '10px' }} className={style['form-label']}>TRAIT VALUE (Required)</Form.Label>
                <Form.Control
                  className={style['form-input']}
                  type="text"
                  value={newTrait.value}
                  data-testid="traitValue"
                  onChange={(event) => {
                    setNewTrait({
                      ...newTrait,
                      value: event.target.value,
                    });
                  }}
                />

                {/* Add Trait Button */}
                <span
                  role="button"
                  tabIndex={0}
                  style={{
                    color: '#4EB9B1', marginTop: '10px', float: 'left', fontWeight: 'bold',
                  }}
                  className={projectStyle['switch-chain-notice']}
                  data-testid="addTrait"
                  onClick={() => {
                    if (newTrait.value.length > 0) {
                      setNewNft({
                        ...newNft,
                        metadata: {
                          ...newNft.metadata,
                          attributes: [
                            ...(newNft.metadata?.attributes || []),
                            {
                              value: newTrait.value,
                              trait_type: newTrait.trait_type.length > 0 ? newTrait.trait_type : undefined,
                            },
                          ],
                        },
                      });

                      setNewTrait({ trait_type: '', value: '' });
                    }
                  }}
                >
                  ADD TRAIT
                </span>
              </Col>

              {/* Metadata Grid */}
              <Col lg={{ offset: 1 }} style={{ borderRadius: '5px' }} className={`${projectStyle['nft-sidebar-field']} mt-3`}>
                <p>PROPERTIES (METADATA)</p>
                <hr />
                <Row style={{ maxHeight: '18vh', overflow: 'auto' }} className="mx-0 px-0 py-1">
                  {newNft?.metadata?.attributes?.map((attribute:any, index:number) => (
                    <Col lg={4} key={attribute.trait_value} className={`${projectStyle['nft-property']} mb-3 mx-2`}>
                      <p style={{
                        fontWeight: 'bold', color: '#4EB9B1', margin: '0px', lineHeight: '20px', fontSize: '12px', padding: '2px',
                      }}
                      >
                        {attribute.trait_type}
                      </p>
                      <p style={{
                        fontWeight: 'bold', margin: '0px', lineHeight: '20px', fontSize: '12px', padding: '0px 2px 0px 2px',
                      }}
                      >
                        {attribute.value}
                      </p>
                      <XCircleFill
                        data-testid="removeImage"
                        className={style['cancel-icon-image']}
                        style={{ top: '-8%', right: '88%' }}
                        size={16}
                        onClick={async () => {
                          const attributes = newNft.metadata.attributes?.filter(
                            (attr, removeIndex) => (removeIndex !== index),
                          );
                          setNewNft({
                            ...newNft,
                            metadata: {
                              ...newNft.metadata,
                              attributes,
                            },
                          });
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Collapse>
          <hr />
        </Col>

        {/* Mint Button */}
        <Col>
          {(chainId?.toString() === contractData?.chainId) ? (
            <Button
              className={projectStyle['add-whitelist-record']}
              onClick={async () => {
                if (!hasMissingFields()) {
                  try {
                    setTransactionLoading({
                      loading: true,
                      header: `Creating a transaction to airdrop an NFT to ${shortenAddress(newNft.userAddress)}`,
                      content: 'Awaiting user signature',
                    });

                    const mintMetadata = { ...newNft.metadata, tierId: newNft.tierId };

                    if (mintMetadata.image) {
                      const cids = await ipfs.addFiles([
                        {
                          file: mintMetadata.image as Blob,
                          fileName: (mintMetadata.image as any)?.name,
                        }]);

                      mintMetadata.image = `ipfs://${cids[0].Hash}`;
                    }

                    const tx = await memberNft?.mintTo(newNft.userAddress, mintMetadata);

                    setTransactionLoading({
                      loading: true,
                      header: `Creating a transaction to airdrop an NFT to ${shortenAddress(newNft.userAddress)}`,
                      content: 'Transaction is being mined',
                    });

                    await tx.wait();

                    refresh();
                    setTransactionLoading({ loading: false });
                    setDropSection('dropTable');
                    setManageProjectsSection('collection');
                  } catch (err:any) {
                    setTransactionLoading({ loading: false });
                    setError({ showError: true, content: err.message });
                  }
                }
              }}
              data-testid="mintButton"
            >
              <Box size={20} className={projectStyle['add-whitelist-icon']} />
              MINT THIS NFT
            </Button>
          ) : null}

        </Col>
      </Row>
    </Row>
  );
}

export default AirDrop;
