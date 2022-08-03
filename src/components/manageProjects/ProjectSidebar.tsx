/* eslint-disable react/jsx-props-no-spreading, no-nested-ternary */
import React, { useState } from 'react';
import {
  Container, Row, Col, ListGroup, Figure, ProgressBar, Card,
} from 'react-bootstrap';
import { Pencil, XCircle, QuestionCircle } from 'react-bootstrap-icons';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import { useDropzone } from 'react-dropzone';
import style from '../../styles/manageProjects.module.css';
import { nftContractUpdates } from '../../state/nftContract';
import { contractsWithMetadataState, selectedContractState, contractMetricsState } from '../../state/contract';
import placeholder from '../../images/dashboard/placeholder.png';
import config from '../../config';
import networks from '../../constants/networks';

function ProjectSidebar() {
  const { address } = useRecoilValue(selectedContractState);
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const contractData = contractsWithMetadata?.contents?.[address as string];

  const contractMetricsLoadable = useRecoilValueLoadable(contractMetricsState);
  const contractMetrics = contractMetricsLoadable?.contents;

  const [contractUpdates, setContractUpdates] = useRecoilState(nftContractUpdates);

  const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectId);
  const [updateImage, setUpdateImage] = useState(false);

  const { getRootProps: getRootPropsImage, getInputProps: getInputPropsImage } = useDropzone({
    maxFiles: 1,
    accept: '.jpg,.jpeg,.png,.gif',
    onDrop: (files) => {
      setContractUpdates({
        ...contractUpdates,
        image: files[0],
      });
      setUpdateImage(!updateImage);
    },
  });

  return (
    <Container>
      {/* Image dropzone */}
      {updateImage ? (
        <div data-testid="dropzone" {...getRootPropsImage({ style: { position: 'relative' } })}>
          <Card className={style['file-upload']}>
            CLICK TO SELECT A FILE...
          </Card>
          <input data-testid="image" {...getInputPropsImage()} />
          <XCircle
            size={24}
            className={style['sidebar-icon']}
            style={{ top: '86%' }}
            onClick={(event) => {
              setUpdateImage(!updateImage);
              event.stopPropagation();
            }}
          />
        </div>
      ) : (
      // Contract Image
        <div style={{ position: 'relative' }}>
          <img
            data-testid="image"
            className={style['sidebar-image']}
            src={contractUpdates.image ? URL.createObjectURL(contractUpdates.image)
              : (contractData?.image ? ipfs.getGatewayUrl(contractData?.image as string) : placeholder)}
            alt={placeholder}
          />
          <Pencil
            data-testid="updateImage"
            size={24}
            className={style['sidebar-icon']}
            onClick={() => {
              setUpdateImage(!updateImage);
            }}
          />
        </div>
      )}

      {(contractData && contractMetrics?.totalSupply?.toString()) ? (
        // Contract Label
        <div>
          <Figure.Caption className={style['sidebar-label-wrapper']}>
            {/* Name */}
            <p style={{ marginTop: '5px' }} className={style['project-name']}>{contractData?.name}</p>

            {/* Vouchers Redeemed */}
            <span
              className={style['project-name']}
              style={{ marginBottom: '5px', fontSize: '11px' }}
            >
              VOUCHERS REDEEMED:
            </span>
            <span
              className={style['project-name']}
              style={{ marginBottom: '5px', fontSize: '12px', fontWeight: 'normal' }}
            >
              {` ${contractData?.totalSupply}/${contractData?.whitelisted}`}
            </span>

            {/* Progress Bar / Network logo */}
            <Row>
              <Col style={{ paddingRight: '0px' }} className="my-auto" lg={7}>
                <ProgressBar id="progress-bar" min={0} max={contractData?.whitelisted} now={contractData?.totalSupply} />
              </Col>
              <Col className="my-auto d-flex flex-row-reverse align-items-center">
                <span
                  className={style.figure}
                  style={{
                    display: 'inline-flex', alignItems: 'center', fontSize: '12px', marginRight: '10px',
                  }}
                >
                  <img
                    className={style['network-logo']}
                    alt={(networks as any)[contractData?.chainId]?.label}
                    src={(networks as any)[contractData?.chainId]?.logo}
                    style={{ height: '20px', width: 'auto' }}
                  />
                  {(networks as any)[contractData?.chainId]?.label}
                </span>
              </Col>
            </Row>
          </Figure.Caption>

          {/* Metrics */}
          <div style={{ backgroundColor: '#F5F5F5', padding: '10px', marginTop: '10px' }}>
            <Row>
              <Col style={{ paddingRight: '5px' }}>
                <div className={style['metric-large']}>
                  <p className={style['metric-title']}>MINTED</p>
                  <p className={style['metric-figure-large']}>{contractMetrics.totalSupply}</p>
                </div>
              </Col>
              <Col style={{ paddingLeft: '5px' }}>
                <div className={style['metric-large']}>
                  <p className={style['metric-title']}>HOLDERS</p>
                  <p className={style['metric-figure-large']}>{contractMetrics.uniqueHolders}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col style={{ paddingRight: '5px' }}>
                <div className={style['metric-small']}>
                  <p className={style['metric-title']}>MINT INCOME</p>
                  <p className={style['metric-figure-small']}>{`$${contractMetrics.contractRevenue}`}</p>
                </div>
              </Col>
              <Col style={{ paddingLeft: '5px' }}>
                <div className={style['metric-small']}>
                  <p className={style['metric-title']}> TRANSFERS </p>
                  <p className={style['metric-figure-small']}>{contractMetrics.transfers}</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        // Placeholders
        <div>
          <Figure.Caption style={{ height: '78px', width: '100%' }} className={`${style['sidebar-label-wrapper']} ${style.placeholder}`} />
          <div style={{ backgroundColor: '#F5F5F5', padding: '10px', marginTop: '10px' }}>
            <Row>
              <Col style={{ paddingRight: '5px' }}>
                <div className={`${style['metric-large']} ${style.placeholder}`} style={{ minHeight: '78px' }} />
              </Col>
              <Col style={{ paddingLeft: '5px' }}>
                <div className={`${style['metric-large']} ${style.placeholder}`} style={{ minHeight: '78px' }} />
              </Col>
            </Row>
            <Row>
              <Col style={{ paddingRight: '5px' }}>
                <div className={`${style['metric-small']} ${style.placeholder}`} style={{ minHeight: '68px' }} />
              </Col>
              <Col style={{ paddingLeft: '5px' }}>
                <div className={`${style['metric-small']} ${style.placeholder}`} style={{ minHeight: '68px' }} />
              </Col>
            </Row>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={style['footer-wrapper']}>
        <hr style={{ margin: '0px 0px 8px 0px' }} />
        {/* Support link */}
        <ListGroup.Item className={style.footer}>
          <Row>
            <Col style={{ padding: '5px 0px 0px 0px' }} xs={1}>
              <QuestionCircle size={20} style={{ alignSelf: 'center' }} />
            </Col>
            <Col style={{ marginLeft: '1px' }}>
              <p style={{ display: 'inline' }}>
                Having issues? Questions?
                {' '}
                <a target="_blank" href="https://www.zkladder.com/#join" rel="noreferrer">Get in touch here.</a>
              </p>
            </Col>
          </Row>

        </ListGroup.Item>
        <hr style={{ margin: '8px 0px 0px 0px' }} />
      </div>

    </Container>
  );
}

export default ProjectSidebar;
