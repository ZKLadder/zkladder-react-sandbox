import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import style from '../../styles/manageProjects.module.css';
import sharedStyle from '../../styles/shared.module.css';
import SearchSidebar from './SearchSidebar';
import ProjectSidebar from './ProjectSidebar';
import AllProjects from './AllProjects';
import ProjectBodyV1 from './memberNftV1/ProjectBody';
import ProjectBodyV2 from './memberNftV2/ProjectBody';
import { selectedContractState } from '../../state/contract';

function ManageProjects() {
  const { contractId } = useParams();
  const setSelectedContract = useSetRecoilState(selectedContractState);

  useEffect(() => {
    if (contractId) {
      const [address, templateId, chainId] = contractId.split('-');
      setSelectedContract({ address, templateId, chainId });
    }
  }, [contractId]);

  if (contractId) {
    const templateId = contractId.split('-')[1];
    return (
      <Row className={sharedStyle['content-wrapper']}>
        {/* Project Sidebar */}
        <Col className={`${style.sidebar} d-none d-lg-block`} lg={3}>
          <ProjectSidebar />
        </Col>

        {/* Project Body */}
        <Col>
          {templateId === '1' ? <ProjectBodyV1 isUnitTest={false} /> : null}
          {templateId === '3' ? <ProjectBodyV2 isUnitTest={false} /> : null}
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
