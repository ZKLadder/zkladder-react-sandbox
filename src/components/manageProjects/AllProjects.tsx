import React, {
  useEffect, useState,
} from 'react';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import {
  Row, Col, ListGroup, Button, Container,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PlusCircleFill } from 'react-bootstrap-icons';
import style from '../../styles/manageProjects.module.css';
import { getContract } from '../../utils/api';
import { walletState } from '../../state/wallet';
import { Contract } from '../../interfaces/contract';
import {
  contractState, filteredContractsState, contractMetricsState,
} from '../../state/contract';
import ProjectBox from './ProjectBox';

function AllProjects() {
  const filteredContracts = useRecoilValue(filteredContractsState);
  const [contracts, setContracts] = useRecoilState(contractState);
  const [numRows, setNumRows] = useState(0);
  const { address } = useRecoilValue(walletState);
  const contractMetrics = useRecoilValueLoadable(contractMetricsState);

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

  // Calculate the number of rows needed to display {filteredContracts.length} boxes
  useEffect(() => {
    const leftOver = filteredContracts.length % 3;
    setNumRows(leftOver === 0 ? Math.ceil(filteredContracts.length / 3.0) + 1 : Math.ceil(filteredContracts.length / 3.0));
  }, [filteredContracts]);

  return (
    <Container className={style['body-wrapper']}>
      {contractMetrics.state === 'hasValue'
        ? (
          // Contract Metrics Group
          <ListGroup className={`d-none d-lg-flex ${style['metrics-wrapper']}`} horizontal>
            <ListGroup.Item className={style.metrics}>
              <p className={style['metrics-title']}>TOTAL PROJECTS </p>
              <p className={style['metrics-figure']}>{contractMetrics.contents?.totalProjects}</p>
            </ListGroup.Item>
            <ListGroup.Item className={style.metrics}>
              <p className={style['metrics-title']}>TOTAL MINTED </p>
              <p className={style['metrics-figure']}>{contractMetrics.contents?.totalMinted}</p>
            </ListGroup.Item>
            <ListGroup.Item className={style.metrics}>
              <p className={style['metrics-title']}>TOTAL FROM MINTS (USD) </p>
              <p className={style['metrics-figure']}>{`$${contractMetrics.contents?.totalRevenue}`}</p>
            </ListGroup.Item>
            <ListGroup.Item className={style.metrics}>
              <p className={style['metrics-title']}>TOTAL TRADES </p>
              <p className={style['metrics-figure']}>{contractMetrics.contents?.totalTrades}</p>
            </ListGroup.Item>
          </ListGroup>
        )
        : (
          // Contract Metrics Placeholder Group
          <ListGroup className={`d-none d-lg-flex ${style['metrics-wrapper']}`} horizontal>
            <ListGroup.Item style={{ height: '77px' }} className={`${style.metrics} ${style.placeholder}`} />
            <ListGroup.Item style={{ height: '77px' }} className={`${style.metrics} ${style.placeholder}`} />
            <ListGroup.Item style={{ height: '77px' }} className={`${style.metrics} ${style.placeholder}`} />
            <ListGroup.Item style={{ height: '77px' }} className={`${style.metrics} ${style.placeholder}`} />
          </ListGroup>
        )}

      {/* Projects section */}
      <div className={style['my-projects-wrapper']}>
        <Row>
          {/* First Row of Projects (max 2) */}
          {filteredContracts?.slice(0, 2).map((contract:Contract) => (
            <ProjectBox key={contract.address} contract={contract} />
          ))}

          {/* Create Project Box */}
          <Col lg={4} style={{ alignSelf: 'top' }}>
            <div className={style['dashboard-create-project']}>
              <Link data-testid="newProject" to="/deploy">
                <Button className={style['new-project-button']}>
                  <PlusCircleFill style={{ marginRight: '5px', verticalAlign: 'bottom' }} size={24} />
                  NEW PROJECT
                </Button>
              </Link>
            </div>
          </Col>
        </Row>

        {/* Loop to generate rows */}
        {[...Array(numRows)].map((currentRow, index) => {
          if (index === 0) return null; // skip first row since it was already rendered above
          return (
            <Row style={{ marginTop: '15px' }}>
              {/* Loop to generate individual projects */}
              {filteredContracts?.slice((index * 3) - 1, (index * 3) + 2).map((contract:Contract) => (
                <ProjectBox key={contract.address} contract={contract} />
              ))}
            </Row>
          );
        })}
      </div>
    </Container>
  );
}

export default AllProjects;
