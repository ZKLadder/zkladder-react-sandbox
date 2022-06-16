import React from 'react';
import {
  Row, Col, Figure, ProgressBar,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import style from '../../styles/manageProjects.module.css';
import config from '../../config';
import networks from '../../constants/networks';
import templates from '../../constants/templates';
import placeholder from '../../images/dashboard/placeholder.png';
import { Contract } from '../../interfaces/contract';
import { contractsWithMetadataState } from '../../state/contract';

function ProjectBox({ contract }:{contract:Contract}) {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectId);
  const {
    address, chainId, templateId,
  } = contract;

  // Render placeholder if contractMetadata is not populated for this contract
  if (!contractsWithMetadata?.contents?.[address]) {
    return (
      <Col key={address} lg={4} data-testid="placeholder">
        <div className={`mx-auto ${style['placeholder-image']} ${style.placeholder}`} />
        <Row style={{ marginTop: '3px' }}>
          <Col style={{ padding: '0px 3px 0px 13px' }}>
            <div style={{ height: '65px', width: '100%' }} className={`${style['project-figure']} ${style.placeholder}`} />
          </Col>
          <Col style={{ padding: '0px 17px 0px 3px' }}>
            <div style={{ height: '65px', width: '100%' }} className={`${style['project-figure']} ${style.placeholder}`} />
          </Col>
        </Row>
        <hr className="d-lg-none" />
      </Col>
    );
  }

  // Render project box data if contractMetadata is populated
  const { contents } = contractsWithMetadata;
  return (
    <Col key={address} lg={4} data-testid="projectData">
      <Figure className={style['project-image']}>
        {/* Contract Image */}
        <Figure.Image
          data-testid="image"
          className={style['project-image']}
          src={contents[address]?.image
            ? ipfs.getGatewayUrl(contents[address]?.image as string) : placeholder}
          alt={placeholder}
        />

        {/* Contract Label */}
        <Link to={`/projects/${address}`}>
          <Figure.Caption className={style['project-label-wrapper']}>
            {/* Name */}
            <p style={{ marginTop: '5px' }} className={style['project-name']}>{contents[address]?.name}</p>

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
              {`${contents[address]?.totalSupply}/${contents[address]?.whitelisted}`}

            </span>

            {/* Vouchers Redeemed Progress Bar */}
            <ProgressBar id="progress-bar" min={0} max={contents[address]?.whitelisted} now={contents[address]?.totalSupply} />
          </Figure.Caption>
        </Link>
      </Figure>

      <Row style={{ margin: '0px', marginTop: '3px' }}>
        {/* Network Box */}
        <Col className={style['project-figure']}>
          <p className={style['figure-title']}>Network</p>
          <span className={style.figure}>
            <img className={style['network-logo']} alt={(networks as any)[chainId]?.label} src={(networks as any)[chainId]?.logo} />
            {(networks as any)[chainId]?.label}
          </span>
        </Col>

        {/* Contract Type */}
        <Col className={style['project-figure']}>
          <span className={style['figure-title']}>Type</span>
          <span className={style.figure}>{(templates as any)[templateId]?.label}</span>
        </Col>
      </Row>
      <hr className="d-lg-none" />
    </Col>
  );
}

export default ProjectBox;
