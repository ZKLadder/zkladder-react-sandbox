/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Form, Card, Button, ListGroup, Badge, Collapse,
} from 'react-bootstrap';
import { useRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';
import { useDropzone } from 'react-dropzone';
import { XCircleFill } from 'react-bootstrap-icons';
import { deployState } from '../../state/deploy';
import { walletState } from '../../state/wallet';
import style from '../../styles/deploy.module.css';
import Tooltip from '../shared/Tooltip';

function ConfigureContract() {
  const resetDeployState = useResetRecoilState(deployState);
  const [deploy, setDeployState] = useRecoilState(deployState);
  const [usingScript, setUsingScript] = useState(false);
  const [missingFields, setMissingFields] = useState({}) as any;
  const { address } = useRecoilValue(walletState);

  useEffect(() => {
    if (!deploy.config.beneficiaryAddress) {
      setDeployState({
        ...deploy,
        config: { ...deploy.config, beneficiaryAddress: address?.[0] as string },
      });
    }
  }, []);

  const hasMissingFields = () => {
    const inputErrors:any = {};

    if (!deploy.config.name) inputErrors.name = 'Required field';
    if (!deploy.config.symbol) inputErrors.symbol = 'Required field';
    if (!deploy.config.beneficiaryAddress) inputErrors.beneficiaryAddress = 'Required field';

    if (Object.keys(inputErrors).length > 0) {
      setMissingFields(inputErrors);
      return true;
    }
    return false;
  };

  const { getRootProps: getRootPropsImage, getInputProps: getInputPropsImage } = useDropzone({
    maxFiles: 1,
    accept: '.jpg,.jpeg,.png,.gif',
    onDrop: (files) => {
      setDeployState({
        ...deploy,
        config: { ...deploy.config, image: files[0] },
      });
    },
  });

  const { getRootProps: getRootPropsScript, getInputProps: getInputPropsScript } = useDropzone({
    maxFiles: 1,
    accept: '.js',
    onDrop: (files) => {
      setDeployState({
        ...deploy,
        config: { ...deploy.config, script: files[0] },
      });
    },
  });

  return (
    <Container style={{ paddingLeft: '25px', paddingTop: '60px' }}>
      <p className={style.title}>
        SET UP YOUR CONTRACT
      </p>
      <p className={style.description}>
        Below you can configure the general metadata for your contract.
        Please keep in mind that once these fields are set,
        it will cost crypto to update them as data on the blockchain is immutable.
      </p>
      <Row style={{ }} className={style['template-wrapper']}>
        <Col lg={8}>
          <div className={style['form-wrapper']}>
            <Row>
              {/* Name field */}
              <Col lg={6}>
                <Form.Label className={style['form-label']}>CONTRACT NAME</Form.Label>
                <Tooltip className={style.tooltip} header="Community Name" body="Specify what your community will be called. Once set, this field cannot be updated" />
                <Form.Control
                  className={style['form-input']}
                  type="text"
                  value={deploy.config.name}
                  isInvalid={missingFields.name}
                  data-testid="name"
                  onChange={(event) => {
                    setDeployState({
                      ...deploy,
                      config: { ...deploy.config, name: event.target.value },
                    });
                  }}
                />
              </Col>

              {/* Symbol field */}
              <Col>
                <Form.Label className={style['form-label']}>CONTRACT SYMBOL</Form.Label>
                <Tooltip className={style.tooltip} header="Trading Symbol" body="Specify your NFTs' symbol should they ever trade in a secondary market. Once set, this field cannot be updated" />
                <Form.Control
                  className={style['form-input']}
                  type="text"
                  value={deploy.config.symbol}
                  isInvalid={missingFields.symbol}
                  data-testid="symbol"
                  onChange={(event) => {
                    setDeployState({
                      ...deploy,
                      config: { ...deploy.config, symbol: event.target.value },
                    });
                  }}
                />
              </Col>
            </Row>

            {/* Description field */}
            <Row>
              <Col>
                <Form.Label style={{ marginTop: '18px' }} className={style['form-label']}>CONTRACT DESCRIPTION</Form.Label>
                <Tooltip className={style.tooltip} header="Description" body="Describe your community in any way you see fit. Once set, updating this field will cost crypto." />
                <Form.Control
                  className={style['form-input']}
                  as="textarea"
                  rows={4}
                  value={deploy.config.description}
                  data-testid="description"
                  onChange={(event) => {
                    setDeployState({
                      ...deploy,
                      config: { ...deploy.config, description: event.target.value },
                    });
                  }}
                />
              </Col>
            </Row>

            {/* Beneficiary Address field */}
            <Row>
              <Col>
                <Form.Label style={{ marginTop: '18px' }} className={style['form-label']}>BENEFICIARY ADDRESS</Form.Label>
                <Tooltip className={style.tooltip} header="Beneficiary Address" body="The beneficiary is the Ethereum Address that recieves proceeds from any mint (sale) of new NFT's. We've prefilled this with your current address for your convenience." />
                <Form.Control
                  className={style['form-input']}
                  type="text"
                  value={deploy.config.beneficiaryAddress}
                  isInvalid={missingFields.beneficiaryAddress}
                  data-testid="beneficiaryAddress"
                  onChange={(event) => {
                    setDeployState({
                      ...deploy,
                      config: { ...deploy.config, beneficiaryAddress: event.target.value },
                    });
                  }}
                />
              </Col>
            </Row>
          </div>
        </Col>

        {/* Image upload */}
        <Col style={{ minHeight: '30vh', display: 'flex' }}>
          <div className={style['form-wrapper']}>
            <Form.Label className={style['form-label']}>COLLECTION IMAGE</Form.Label>
            <Form.Label style={{ fontWeight: 'normal' }} className={style['form-label']}>This represents your collection everywhere on the platform</Form.Label>
            {deploy.config.image
              ? (
                <div style={{ height: '21vh' }}>
                  {/* Image dropzone */}
                  <img data-testid="imagePreview" alt={deploy.config.image.name} className={style['image-preview']} src={URL.createObjectURL(deploy.config.image)} />
                  <XCircleFill
                    data-testid="removeImage"
                    className={style['cancel-icon-image']}
                    size={36}
                    onClick={async () => {
                      setDeployState({
                        ...deploy,
                        config: { ...deploy.config, image: undefined },
                      });
                    }}
                  />
                </div>
              )
              : (
                <div data-testid="dropzone" {...getRootPropsImage({ style: { height: '75%' } })}>
                  {/* Image preview */}
                  <Card className={style['file-upload']}>
                    DRAG AND DROP OR CLICK TO SELECT A FILE
                  </Card>
                  <input data-testid="image" {...getInputPropsImage()} />
                </div>
              )}
          </div>
        </Col>
      </Row>

      {/* Script upload */}
      <Row className={style['template-wrapper']}>
        <Col>
          <div className={style['form-wrapper']}>
            <Col>
              <Form.Check
                checked={usingScript || deploy.config.script}
                className={style['form-label']}
                type="switch"
                data-testid="checkmark"
                label={(
                  <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                    IS YOUR NFT USING A GENERATIVE ART SCRIPT?
                    <Tooltip className={style.tooltip} header="JS Animation" body="Please ensure your script is a valid JS file which adheres to our standards. ZKLadder only supports scripts built with P5.js at the moment." />
                  </span>
                  )}
                onChange={() => {
                  setUsingScript(!usingScript);
                  setDeployState({
                    ...deploy,
                    config: { ...deploy.config, script: undefined },
                  });
                }}
              />

            </Col>
            <Collapse in={usingScript || deploy.config.script}>
              <div>
                <hr />
                {/* Script upload dropzone */}
                <div className={style['script-upload']} {...getRootPropsScript({})}>
                  <input data-testid="script" {...getInputPropsScript()} />
                  <p>UPLOAD YOUR SCRIPT (.js)</p>
                </div>
                {/* Files to Be Uploaded Section */}
                {deploy.config.script
                  ? (
                    <ListGroup style={{ maxHeight: '170px', overflow: 'auto' }}>
                      <ListGroup.Item key={deploy.config.script.name}>
                        {deploy.config.script.name}
                        <Badge
                          className={style['bytes-indicator']}
                        >
                          {deploy.config.script.size}
                          {' '}
                          bytes
                        </Badge>
                        <XCircleFill
                          data-testid="removeImage"
                          className={style['cancel-icon']}
                          size={22}
                          onClick={async () => {
                            setUsingScript(false);
                            setDeployState({
                              ...deploy,
                              config: { ...deploy.config, script: undefined },
                            });
                          }}
                        />
                      </ListGroup.Item>
                    </ListGroup>
                  ) : null}
              </div>
            </Collapse>
          </div>
        </Col>
      </Row>

      {/* Continue and Return buttons */}
      <Row>
        <Col xs={6}>
          <Button
            className={style['continue-button']}
            data-testid="continueButton"
            onClick={() => {
              if (!hasMissingFields()) {
                setDeployState({
                  ...deploy,
                  currentStep: 3,
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
            data-testid="returnButton"
            onClick={resetDeployState}
          >
            DELETE AND RETURN TO TEMPLATE SELECTION
          </Button>
        </Col>
      </Row>
    </Container>

  );
}

export default ConfigureContract;
