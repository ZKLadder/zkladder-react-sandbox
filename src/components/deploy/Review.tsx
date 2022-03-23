import React, { useState } from 'react';
import {
  Container, Row, Col, Button, ListGroup, Badge,
} from 'react-bootstrap';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { MemberNft, Ipfs } from '@zkladder/zkladder-sdk-ts';
import { deployState } from '../../state/deploy';
import style from '../../styles/deploy.module.css';
import Tooltip from '../shared/Tooltip';
import { walletState } from '../../state/wallet';
import networks from '../../constants/networks';
import config from '../../config';
import Error from '../shared/Error';
import { loadingState } from '../../state/page';
import CopyToClipboard from '../shared/CopyToClipboard';
import { createContract } from '../../utils/api';

const castNetworks = networks as any;

function Review() {
  const [deploy, setDeployState] = useRecoilState(deployState);
  const { chainId, provider, address } = useRecoilValue(walletState);
  const [contractAddress, setAddress] = useState() as any;
  const setLoading = useSetRecoilState(loadingState);
  const [error, setError] = useState() as any;

  return (
    <Container style={{ paddingLeft: '25px', paddingTop: '60px' }}>
      <p className={style.title}>
        REVIEW AND CONFIRM YOUR DEPLOYMENT
      </p>
      <p className={style.description}>
        Please ensure your contract details are correct. Fields like &quot;name&quot; and &quot;symbol&quot; are immutable.
        Other fields will cost gas to update.
      </p>

      {/* Network field */}
      <Row className={style['template-wrapper']}>
        <div className={style['form-wrapper']}>
          <Row>
            <Col className={style['template-title']}>
              Network:
              <span className={style['config-field']}>
                {castNetworks[chainId as number].label}
                <Tooltip className={style.tooltip} header="Blockchain Network" body="ZKLadder supports deploying contracts onto Ethereum Mainnet, as well as various L2's and Testnets. Ensure this is the network you want or update your network within your crypto wallet." />
              </span>
            </Col>
          </Row>
        </div>

        <div style={{ marginTop: '5px' }} className={style['form-wrapper']}>
          <Row>

            {/* Collection symbol field */}
            <Col className={style['template-title']} lg={3}>
              Collection Symbol:
              <ListGroup.Item className={style['config-field']}>
                {deploy.config.symbol}
              </ListGroup.Item>
            </Col>

            {/* Collection name field */}
            <Col className={style['template-title']} lg={4}>
              Collection Name:
              <ListGroup.Item className={style['config-field']}>
                {deploy.config.name}
              </ListGroup.Item>
            </Col>

            {/* Collection beneficiary address field */}
            <Col className={style['template-title']}>
              Beneficiary Address:
              <ListGroup.Item className={style['config-field']}>
                {deploy.config.beneficiaryAddress}
              </ListGroup.Item>
            </Col>
          </Row>
        </div>

        <div style={{ marginTop: '5px' }} className={style['form-wrapper']}>
          <Row>
            {/* Collection description field */}
            <Col className={style['template-title']} lg={7}>
              Collection Description:
              <span className={style['config-field']}>
                {deploy.config.description}
              </span>
            </Col>

            {/* Collection image field */}
            {deploy.config.image ? (
              <Col className={style['template-title']}>
                Collection Image:
                <span style={{ height: '21vh' }} className={style['config-field']}>
                  <img data-testid="imagePreview" alt={deploy.config.image.name} className="image-preview" src={URL.createObjectURL(deploy.config.image)} />
                </span>
              </Col>
            ) : null}

          </Row>
        </div>

        {/* Collection script field */}
        {
          deploy.config.script
            ? (
              <div style={{ marginTop: '5px' }} className={style['form-wrapper']}>
                <Row>
                  <Col className={style['template-title']}>
                    Generative Script
                    <span className={style['config-field']}>
                      <ListGroup style={{ maxHeight: '170px', overflow: 'auto' }}>
                        <ListGroup.Item key={deploy.config.script.name}>
                          {deploy.config.script.name}
                          <Badge className={style['bytes-indicator']}>
                            {deploy.config.script.size}
                            {' '}
                            bytes
                          </Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </span>
                  </Col>
                </Row>
              </div>
            ) : null
          }

        {/* Scrollable roles container */}
        <div style={{ marginTop: '5px', maxHeight: '275px', overflow: 'scroll' }} className={style['form-wrapper']}>
          <Row>
            <Col className={style['template-title']}>
              {`Roles: (${deploy.roles.length} total)`}
              <hr />
              {/* Roles sections */}
              {deploy.roles.map((role) => (
                <div style={{ marginTop: '10px', width: '98%' }} className={style['config-field']}>
                  <Row>
                    <Col>
                      Role Name:
                      <ListGroup.Item style={{ borderRadius: '10px' }}>
                        {role.name}
                      </ListGroup.Item>
                    </Col>
                    <Col>
                      Role ID:
                      <ListGroup.Item style={{ borderRadius: '10px' }}>
                        {role.id}
                      </ListGroup.Item>
                    </Col>
                    <Col>
                      Mint Price:
                      <ListGroup.Item style={{ borderRadius: '10px' }}>
                        {`${role.price}  ${castNetworks[chainId as number].token}`}
                      </ListGroup.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '5px' }}>
                    <Col>
                      Role Description:
                      <ListGroup.Item style={{ borderRadius: '10px' }}>
                        {role.description}
                      </ListGroup.Item>
                    </Col>
                  </Row>
                </div>
              ))}
            </Col>
          </Row>
        </div>

      </Row>
      <Row>
        {/* Mint button */}
        <Col xs={6}>
          <Button
            className={style['continue-button']}
            onClick={async () => {
              setLoading({ loading: true, header: 'Member NFT Deployment', content: 'Awaiting wallet approval...' });
              setError(false);
              try {
                const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectSecret);
                let imageHash;
                let scriptHash;

                if (deploy.config.image) {
                  const cids = await ipfs.addFiles([{ file: deploy.config.image, fileName: deploy.config.image.name }]);
                  imageHash = `ipfs://${cids[0].Hash}`;
                }

                if (deploy.config.script) {
                  const cids = await ipfs.addFiles([{ file: deploy.config.script, fileName: deploy.config.script.name }]);
                  scriptHash = `ipfs://${cids[0].Hash}`;
                }

                const deployTx = await MemberNft.deploy({
                  provider,
                  collectionData: {
                    name: deploy.config.name,
                    symbol: deploy.config.symbol,
                    description: deploy.config.description,
                    beneficiaryAddress: deploy.config.beneficiaryAddress,
                    image: imageHash,
                    script: scriptHash,
                    roles: deploy.roles,
                  },
                  infuraIpfs: {
                    projectId: config.ipfs.projectId,
                    projectSecret: config.ipfs.projectSecret,
                  },
                });

                setAddress(deployTx.address);
                setLoading({ loading: true, header: 'Member NFT Deployment', content: 'Transaction is being mined...' });

                await createContract({
                  address: deployTx.address,
                  creator: address?.[0] as string,
                  admins: [],
                  chainId: chainId?.toString() as string,
                  templateId: '3',
                });

                await deployTx.transaction.wait();

                // @TODO Push the user to the 'manage projects' page
                setLoading({ loading: false });
              } catch (err:any) {
                setLoading({ loading: false });
                setError(err.message || 'There was a problem with deployment');
              }
            }}
          >
            DEPLOY YOUR SMART CONTRACT
          </Button>
        </Col>

        {/* Return button */}
        <Col>
          <Button
            className={style['return-button']}
            onClick={() => {
              setDeployState({
                ...deploy,
                currentStep: 3,
              });
            }}
          >
            RETURN TO ROLE CONFIGURATION
          </Button>
        </Col>
      </Row>
      {/* Success and Error indicators */}
      {contractAddress ? (
        <div style={{ marginTop: '20px' }}>
          Contract Address
          <CopyToClipboard text={contractAddress} />
        </div>
      ) : null }
      {error ? <Error text={error} /> : null}
    </Container>
  );
}

export default Review;
