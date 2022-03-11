import React from 'react';
import { Col, Row } from 'react-bootstrap';
import sharedStyle from '../../styles/shared.module.css';
import DashboardSidebar from './Sidebar';
import MyProjects from './MyProjects';

function Dashboard() {
  return (
    <Row className={sharedStyle['content-wrapper']}>
      {/* Left Hand Sidebar */}
      <Col className={`${sharedStyle.sidebar} d-none d-lg-block`} lg={3}>
        <DashboardSidebar />
      </Col>

      {/* Main Contents */}
      <Col>
        <MyProjects />
      </Col>
    </Row>

  );
}

export default Dashboard;
