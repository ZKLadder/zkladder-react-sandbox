import React, { useEffect } from 'react';
import {
  Container, Row, Col, Button,
} from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { contractState } from '../../state/contract';
import { walletState } from '../../state/wallet';
import style from '../../styles/memberDashboard.module.css';
import { getContract } from '../../utils/api';
import ProjectBox from '../manageProjects/ProjectBox';

function MyProjects() {
  const [contracts, setContracts] = useRecoilState(contractState);
  const { address } = useRecoilValue(walletState);

  // Fetch all of the users projects and filter based on search params
  useEffect(() => {
    async function getContracts() {
      const contractRecords = await getContract({ userAddress: address?.[0] });
      setContracts(contractRecords);
    }
    if (!contracts.length) {
      getContracts();
    }
  }, []);

  return (
    <Container>
      <div className={style['my-projects-wrapper']}>
        {/* Header Text */}
        <p className={style['my-projects-title']}>
          <span>MY PROJECTS</span>
          <Link className={style['my-projects-link']} to="/projects">
            <span>SHOW ALL</span>
          </Link>
        </p>
        <hr className="d-lg-none" />
        <Row>
          {/* Deployed Contracts Boxes (2 columns max) */}
          {contracts.slice(0, 2).map((contract) => (
            <ProjectBox contract={contract} />
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
