import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PageBody from '../shared/PageBody';
import UnauthenticatedSidebar from './UnauthenticatedSidebar';
import PostsMenu from './PostsMenu';
// import EventsMenu from './EventsMenu';
import Navbar from '../navbar/Navbar';
import style from '../../styles/shared.module.css';

function Unauthenticated() {
  return (
    <PageBody color={{ start: '#A40A3E', end: '#DB0056' }}>

      {/* Navbar */}
      <Navbar variant="unauthenticated" />

      {/* Left Hand Sidebar */}
      <Row className={style['content-wrapper']}>
        <Col className={`${style.sidebar} d-none d-lg-block`} lg={3}>
          <UnauthenticatedSidebar />
        </Col>

        {/* Main Contents */}
        <Col lg={9}>
          <PostsMenu />
          {/* <EventsMenu endpoint={endpoint} /> */}
        </Col>
      </Row>
    </PageBody>
  );
}

export default Unauthenticated;
