/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Form, Card, Button,
} from 'react-bootstrap';
import { useRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';
import { useDropzone } from 'react-dropzone';
import { XCircleFill } from 'react-bootstrap-icons';
import { deployState } from '../../../state/deploy';
import { walletState } from '../../../state/wallet';
import style from '../../../styles/deploy.module.css';
import sharedStyle from '../../../styles/shared.module.css';
import Tooltip from '../../shared/Tooltip';
import { isValidUrl } from '../../../utils/helpers';

function ConfigureContract() {
  const resetDeployState = useResetRecoilState(deployState);
  const [deploy, setDeployState] = useRecoilState(deployState);
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
    if (deploy.config.external_link?.length > 0 && !isValidUrl(deploy.config.external_link)) inputErrors.external_link = 'Must be a valid URL';

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

  return (
    <Container className={sharedStyle['body-wrapper']}>
      <p className={style.title}>
        SET UP YOUR CONTRACT
      </p>
      <p className={style.description}>
        Below you can configure the general metadata for your contract.
        Please keep in mind that once these fields are set,
        you will incur a gas cost when updating them.
      </p>
      <Row style={{ }} className={style['template-wrapper']}>
        <Col lg={8}>
          <div className={style['form-wrapper']}>
            <Row>
              {/* Name field */}
              <Col lg={6}>
                <Form.Label className={style['form-label']}>COMMUNITY NAME</Form.Label>
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

            {/* External Link field */}
            <Row>
              <Col>
                <Form.Label style={{ marginTop: '18px' }} className={style['form-label']}>COMMUNITY WEB URL</Form.Label>
                <Tooltip className={style.tooltip} header="Web URL" body="Include a link to your website or social media page which can be displayed by marketplaces like Opensea." />
                <Form.Control
                  className={style['form-input']}
                  type="url"
                  value={deploy.config.external_link}
                  isInvalid={missingFields.external_link}
                  data-testid="externalLink"
                  onChange={(event) => {
                    setDeployState({
                      ...deploy,
                      config: { ...deploy.config, external_link: event.target.value },
                    });
                  }}
                />
              </Col>
            </Row>

            {/* Description field */}
            <Row>
              <Col>
                <Form.Label style={{ marginTop: '18px' }} className={style['form-label']}>COMMUNITY DESCRIPTION</Form.Label>
                <Tooltip className={style.tooltip} header="Description" body="Describe your community in any way you see fit." />
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
                <Tooltip className={style.tooltip} header="Beneficiary Address" body="The beneficiary is the Ethereum Address that recieves proceeds from any mint or sale of NFT's. We've prefilled this with your current address for your convenience." />
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
