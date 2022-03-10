import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PageBody from '../shared/PageBody';
import UnauthenticatedSidebar from './UnauthenticatedSidebar';
import Navbar from '../navbar/Navbar';

function Unauthenticated() {
  return (
    <PageBody color={{ start: '#A40A3E', end: '#DB0056' }}>
      <Navbar variant="unauthenticated" />
      <Row className="content-wrapper">
        <Col className="sidebar d-none d-lg-block" lg={3}>
          <UnauthenticatedSidebar />
        </Col>
        <Col>
          {/* TODO: Scrolling Carousel and CMS */}
        </Col>
      </Row>
    </PageBody>
  );
}

export default Unauthenticated;
