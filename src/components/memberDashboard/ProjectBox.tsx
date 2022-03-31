import React, { useEffect, useState } from 'react';
import { MemberNft, Ipfs } from '@zkladder/zkladder-sdk-ts';
import { Row, Col } from 'react-bootstrap';
import style from '../../styles/memberDashboard.module.css';
import config from '../../config';
import placeholder from '../../images/dashboard/placeholder.png';
import networks from '../../constants/networks';
import Loading from '../shared/Loading';

const castNetworks = networks as any;

function ProjectBox({ address, chainId, whitelisted }:{address: string, chainId:string, whitelisted:number}) {
  const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectId);
  const [contractData, setContractData] = useState({}) as any;
  const [error, setError] = useState() as any;

  useEffect(() => {
    async function getCollectionMetadata() {
      try {
        const instance = await MemberNft.setup({
          chainId: parseInt(chainId, 10),
          address,
          infuraIpfsProjectId: config.ipfs.projectId,
          infuraIpfsProjectSecret: config.ipfs.projectSecret,
        });

        const metadata = await instance.getCollectionMetadata();
        const totalSupply = await instance.totalSupply();
        setContractData({
          ...contractData,
          ...metadata,
          totalSupply,
        });
      } catch (err:any) {
        setError(err.message);
      }
    }

    getCollectionMetadata();
  }, []);

  if (error) return null;
  if (!contractData?.name) return <Loading />;
  return (
    <div>
      {/* Contract Image */}
      <Row>
        <Col lg={12}>
          <img
            className={style['contract-image']}
            alt={contractData.name}
            src={contractData.image ? ipfs.getGatewayUrl(contractData.image) : placeholder}
          />

          {/* Contract Label With Name & Template */}
          <div className={style['contract-label']}>
            <Col>
              <span className={style['contract-name']}>{contractData.name}</span>
            </Col>
            <hr style={{ margin: '5px 0px 5px 0px' }} />
            <Col>
              <span className={style['figure-title']} style={{ display: 'inline' }}>Template: </span>
              <span className={style['figure-title']} style={{ display: 'inline', fontWeight: 'normal' }}>Member NFT</span>
            </Col>
          </div>
        </Col>
      </Row>
      <Row style={{ margin: '0px' }}>
        {/* Network Box @TODO Add mouseover which also displays network name alongside icon */}
        <Col className={style['contract-figure']}>
          <span className={style['figure-title']}>Network</span>
          <img style={{ marginLeft: 'auto' }} className={style['network-logo']} alt={castNetworks[chainId].label} src={castNetworks[chainId].logo} />
        </Col>

        {/* Whitelist Box */}
        <Col className={style['contract-figure']}>
          <span className={style['figure-title']}>Whitelist</span>
          <span className={style.figure}>{whitelisted}</span>
        </Col>

        {/* Members Box */}
        <Col className={style['contract-figure']}>
          <span className={style['figure-title']}>Members</span>
          <span className={style.figure}>{contractData.totalSupply}</span>
        </Col>
      </Row>

      {/* Adds linebreak on smaller resolution */}
      <hr className="d-lg-none" />
    </div>
  );
}

export default ProjectBox;
