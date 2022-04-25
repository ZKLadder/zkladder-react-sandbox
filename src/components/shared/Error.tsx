import React from 'react';
import {
  Alert, Container, Row,
} from 'react-bootstrap';
import style from '../../styles/error.module.css';

function Error({ text }:{text:string}) {
  return (
    <Container>
      <Row>
        <Alert variant="danger" className={style.error}>
          {text}
        </Alert>
      </Row>
    </Container>
  );
}

export default Error;
