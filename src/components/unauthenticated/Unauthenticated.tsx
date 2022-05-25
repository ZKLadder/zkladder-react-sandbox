import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { QueryClient, QueryClientProvider } from 'react-query';
import PageBody from '../shared/PageBody';
import UnauthenticatedSidebar from './UnauthenticatedSidebar';
import PostsMenu from './PostsMenu';
import EventsMenu from './EventsMenu';
import Navbar from '../navbar/Navbar';
import style from '../../styles/shared.module.css';

const client = new QueryClient();
const endpoint = 'https://api-us-east-1.graphcms.com/v2/cl12mkshi8t8s01za53ae9b2y/master';

function Unauthenticated() {
  return (
    <QueryClientProvider client={client}>
      <PageBody color={{ start: '#A40A3E', end: '#DB0056' }}>
        <Navbar variant="unauthenticated" />
        <Row className={style['content-wrapper']}>
          <Col className={`${style.sidebar} d-none d-lg-block`} lg={3}>
            <UnauthenticatedSidebar />
          </Col>
          <Col lg={9}>
            <PostsMenu endpoint={endpoint} />
            <EventsMenu endpoint={endpoint} />
          </Col>
        </Row>
      </PageBody>
    </QueryClientProvider>
  );
}

export default Unauthenticated;
