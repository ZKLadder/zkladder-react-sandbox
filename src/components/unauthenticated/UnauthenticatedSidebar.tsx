import React from 'react';
import {
  Container,
} from 'react-bootstrap';
import logo from '../../images/memberMint/logo_transparent.png';
import style from '../../styles/unauthenticated.module.css';

function UnauthenticatedSidebar() {
  return (
    <Container>
      <img
        alt="zkl-logo"
        src={logo}
        width="205"
        height="35"
        style={{ marginTop: '5px' }}
      />
      <hr />
      {/* Description */}
      <p className={style.description}>
        Welcome to the ZKLadder Venture Studio.
        We are a community of industry experts that build and support a curated portfolio of ventures in Web3.
        <br />
        <b>
          <a href="https://www.zkladder.com/#join"> Get in touch to learn more </a>
        </b>
      </p>

      {/* Info cards */}
      {/* TODO: replace dummy numbers with actual figures pulled from api. */}
      {/*
      <Row className={style['card-row']} style={{ padding: '0px', margin: '0px' }}>
        <Col style={{ margin: '0px', padding: '0px' }} xs={6}>
          <Row style={{ margin: '5px 5px 5px 0px' }} className={style['sidebar-card']}>
            <Col xs={3} className={`${style.column} ${style['number-text']}`}><b>0 </b></Col>
            <Col className={`${style.column} ${style['card-text']}`}>Creators working with our team</Col>
          </Row>
        </Col>

        <Col style={{ margin: '0px', padding: '0px' }} xs={6}>
          <Row style={{ margin: '5px 0px 5px 5px' }} className={style['sidebar-card']}>
            <Col lg={3} className={`${style.column} ${style['number-text']}`}><b>27</b></Col>
            <Col className={`${style.column} ${style['card-text']}`}>Members in our community</Col>
          </Row>
        </Col>
      </Row>

      <Row className={style['card-row']} style={{ padding: '0px', margin: '0px' }}>
        <Col style={{ margin: '0px', padding: '0px' }} xs={6}>
          <Row style={{ margin: '5px 5px 5px 0px' }} className={style['sidebar-card']}>
            <Col lg={3} className={`${style.column} ${style['number-text']}`}><b>2</b></Col>
            <Col className={`${style.column} ${style['card-text']}`}>Ventures launched by ZKL</Col>
          </Row>
        </Col>

        <Col style={{ margin: '0px', padding: '0px' }} xs={6}>
          <Row style={{ margin: '5px 0px 5px 5px' }} className={style['sidebar-card']}>
            <Col lg={3} className={`${style.column} ${style['number-text']}`}><b>1</b></Col>
            <Col className={`${style.column} ${style['card-text']}`}>Smart contracts deployed</Col>
          </Row>
        </Col>
      </Row>
      */}
    </Container>
  );
}

export default UnauthenticatedSidebar;
