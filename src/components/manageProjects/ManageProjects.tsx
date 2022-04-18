import React from 'react';
import { Row, Col } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
import style from '../../styles/manageProjects.module.css';
import sharedStyle from '../../styles/shared.module.css';
import SearchSidebar from './SearchSidebar';
import AllProjects from './AllProjects';

function ManageProjects() {
  /* @TODO Uncomment when building contract specific manager
    const path = useParams();
  if (path.contractId) {
    return (
      <Row className={style['content-wrapper']}>
        <p>
          {path.contractid}
        </p>
      </Row>
    );
  } */

  return (
    <Row className={sharedStyle['content-wrapper']}>
      {/* Sidebar Section */}
      <Col className={`${style.sidebar} d-none d-lg-block`} lg={3}>
        <SearchSidebar />
      </Col>

      {/* Body Section */}
      <Col>
        <AllProjects />
      </Col>
    </Row>

  );
}

export default ManageProjects;
