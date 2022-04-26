import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { ApolloProvider } from '@apollo/client';
import { client } from './ApolloClient/client';
import PageBody from '../shared/PageBody';
import UnauthenticatedSidebar from './UnauthenticatedSidebar';
import PostsMenu from './PostsMenu';
import EventsMenu from './EventsMenu';
import Navbar from '../navbar/Navbar';
import style from '../../styles/shared.module.css';

function Unauthenticated() {
  return (
    <ApolloProvider client={client}>
      <PageBody color={{ start: '#A40A3E', end: '#DB0056' }}>
        <Navbar variant="unauthenticated" />
        <Row className={style['content-wrapper']}>
          <Col className={`${style.sidebar} d-none d-lg-block`} lg={3}>
            <UnauthenticatedSidebar />
          </Col>
          <Col lg={9}>
            <PostsMenu />
            <EventsMenu />
          </Col>
        </Row>
      </PageBody>
    </ApolloProvider>
  );
}

export default Unauthenticated;
