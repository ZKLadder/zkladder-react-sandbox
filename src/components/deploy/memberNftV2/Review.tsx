import React, { useState } from 'react';
import {
  Container, Row, Col, Button, ListGroup,
} from 'react-bootstrap';
import {
  useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState,
} from 'recoil';
import { MemberNftV2, Ipfs } from '@zkladder/zkladder-sdk-ts';
import { useNavigate } from 'react-router-dom';
import { deployState } from '../../../state/deploy';
import style from '../../../styles/deploy.module.css';
import sharedStyle from '../../../styles/shared.module.css';
import Tooltip from '../../shared/Tooltip';
import { walletState } from '../../../state/wallet';
import networks from '../../../constants/networks';
import config from '../../../config';
import Error from '../../shared/Error';
import { loadingState, contractRefreshCounter } from '../../../state/page';
import { createContract } from '../../../utils/api';

const castNetworks = networks as any;

function Review() {
  const [deploy, setDeployState] = useRecoilState(deployState);
  const resetDeployState = useResetRecoilState(deployState);
  const { chainId, provider, address } = useRecoilValue(walletState);
  const setLoading = useSetRecoilState(loadingState);
  const [error, setError] = useState() as any;
  const navigate = useNavigate();
  const [refresh, setRefresh] = useRecoilState(contractRefreshCounter);

  return (
    <Container className={sharedStyle['body-wrapper']}>
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

            {/* Collection name field */}
            <Col className={style['template-title']}>
              <span style={{ display: 'block' }}>Community Name:</span>
              <ListGroup.Item className={style['config-field']}>
                {deploy.config.name}
              </ListGroup.Item>
            </Col>

            {/* Collection symbol field */}
            <Col className={style['template-title']}>
              <span style={{ display: 'block' }}>Collection Symbol:</span>
              <ListGroup.Item className={style['config-field']}>
                {deploy.config.symbol}
              </ListGroup.Item>
            </Col>

            {/* Collection URL field */}
            <Col className={style['template-title']}>
              <span style={{ display: 'block' }}>Community Web URL:</span>
              <ListGroup.Item className={style['config-field']}>
                {deploy.config.external_link}
              </ListGroup.Item>
            </Col>
          </Row>
        </div>

        <div style={{ marginTop: '5px' }} className={style['form-wrapper']}>
          <Row>

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
              <span style={{ display: 'block' }}>Community Description:</span>
              <span className={style['config-field']}>
                {deploy.config.description}
              </span>
            </Col>

            {/* Collection image field */}
            {deploy.config.image ? (
              <Col className={style['template-title']}>
                Collection Image:
                <span style={{ height: '21vh' }} className={style['config-field']}>
                  <img data-testid="imagePreview" alt={deploy.config.image.name} className={style['image-preview']} src={URL.createObjectURL(deploy.config.image)} />
                </span>
              </Col>
            ) : null}

          </Row>
        </div>

      </Row>
      <Row>
        {/* Deploy button */}
        <Col xs={6}>
          <Button
            className={style['continue-button']}
            onClick={async () => {
              setLoading({ loading: true, header: 'Member NFT Deployment', content: 'Awaiting wallet approval...' });
              setError(false);
              try {
                const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectSecret);
                let imageHash;

                if (deploy.config.image) {
                  const cids = await ipfs.addFiles([{ file: deploy.config.image, fileName: deploy.config.image.name }]);
                  imageHash = `ipfs://${cids[0].Hash}`;
                }

                const deployTx = await MemberNftV2.deploy({
                  provider,
                  collectionData: {
                    name: deploy.config.name,
                    symbol: deploy.config.symbol,
                    description: deploy.config.description,
                    external_link: deploy.config.external_link,
                    beneficiaryAddress: deploy.config.beneficiaryAddress,
                    image: imageHash,
                  },
                  infuraIpfs: {
                    projectId: config.ipfs.projectId,
                    projectSecret: config.ipfs.projectSecret,
                  },
                });

                setLoading({ loading: true, header: 'Member NFT Deployment', content: 'Transaction is being mined...' });

                await createContract({
                  address: deployTx.address,
                  creator: address?.[0] as string,
                  chainId: chainId?.toString() as string,
                  templateId: '3',
                });

                await deployTx.transaction.wait();

                setTimeout(() => {
                  setRefresh(refresh + 1);
                  resetDeployState();
                  navigate('/projects');
                  setLoading({ loading: false });
                }, 3000);
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
                currentStep: 2,
              });
            }}
          >
            RETURN TO CONTRACT CONFIGURATION
          </Button>
        </Col>
      </Row>
      {error ? <Error text={error} /> : null}
    </Container>
  );
}

export default Review;
