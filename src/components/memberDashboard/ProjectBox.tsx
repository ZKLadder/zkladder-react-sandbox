import React, { useEffect, useState } from 'react';
import { Col, Button, Plus } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { MemberNft } from '@zkladder/zkladder-sdk-ts';
import { walletState } from '../../state/wallet';
import style from '../../styles/memberDashboard.module.css';
import { getContract } from '../../utils/api';
import config from '../../config';

function ProjectBox({ address }:{address: string}) {
  const { provider } = useRecoilValue(walletState);
  const [contractData, setContractData] = useState({});

  useEffect(() => {
    async function getCollectionMetadata() {
      const instance = await MemberNft.setup({
        provider,
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
    }

    getCollectionMetadata();
  }, []);

  useEffect(() => {

  }, []);
  return (
    <Col lg={4}>
      <div className={style['dashboard-create-project']}>
        <Link to="/deploy">
          <Button className={style['new-project-button']}>
            <Plus style={{ verticalAlign: 'bottom' }} size={24} />
            NEW PROJECT
          </Button>
        </Link>
      </div>
    </Col>
  );
}

export default ProjectBox;
