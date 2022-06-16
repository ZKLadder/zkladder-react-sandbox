import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import style from '../../styles/manageProjects.module.css';
import sharedStyle from '../../styles/shared.module.css';
import SearchSidebar from './SearchSidebar';
import ProjectSidebar from './ProjectSidebar';
import AllProjects from './AllProjects';
import ProjectBody from './ProjectBody';
import { selectedContractState } from '../../state/contract';

function ManageProjects() {
  const { address } = useParams();
  const setSelectedContract = useSetRecoilState(selectedContractState);

  useEffect(() => {
    if (address) {
      setSelectedContract(address);
    }
  }, [address]);

  if (address) {
    return (
      <Row className={sharedStyle['content-wrapper']}>
        {/* Project Sidebar */}
        <Col className={`${style.sidebar} d-none d-lg-block`} lg={3}>
          <ProjectSidebar />
        </Col>

        {/* Project Body */}
        <Col>
          <ProjectBody isUnitTest={false} />
        </Col>
      </Row>
    );
  }

  return (
    <Row className={sharedStyle['content-wrapper']}>
      {/* General Sidebar with Search */}
      <Col className={`${style.sidebar} d-none d-lg-block`} lg={3}>
        <SearchSidebar />
      </Col>

      {/* Projects Overview Section */}
      <Col>
        <AllProjects />
      </Col>
    </Row>
  );
}

export default ManageProjects;
