import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Button,
} from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { walletState } from '../../state/wallet';
import style from '../../styles/memberDashboard.module.css';
import { getContract } from '../../utils/api';
import ProjectBox from './ProjectBox';

function MyProjects() {
  const [contracts, setContracts] = useState([]) as any[];
  const { address } = useRecoilValue(walletState);

  useEffect(() => {
    async function getContracts() {
      const contractRecords = await getContract({ userAddress: address?.[0] as string });
      setContracts(contractRecords.slice(0, 2));
    }
    getContracts();
  }, []);

  return (
    <Container>
      <div className={style['my-projects-wrapper']}>
        {/* Header Text */}
        <p className={style['my-projects-title']}>
          <span>MY PROJECTS</span>
          <span className={style['my-projects-link']}>SHOW ALL</span>
        </p>
        <hr className="d-lg-none" />
        <Row>
          {/* Deploy Contracts Boxes (2 columns max) */}
          {contracts.map((contract:{chainId:string, address:string, whitelisted:number}) => (
            <Col className="my-auto" lg={4}>
              <ProjectBox
                whitelisted={contract.whitelisted}
                chainId={contract.chainId}
                address={contract.address}
              />
            </Col>
          ))}

          {/* Create Project Box */}
          <Col lg={4} style={{ alignSelf: 'top' }}>
            <div className={style['dashboard-create-project']}>
              <Link to="/deploy">
                <Button className={style['new-project-button']}>
                  <Plus style={{ verticalAlign: 'bottom' }} size={24} />
                  NEW PROJECT
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default MyProjects;
