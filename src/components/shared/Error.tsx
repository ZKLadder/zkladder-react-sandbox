import React from 'react';
import {
  Alert, Container, Row,
} from 'react-bootstrap';
import '../../styles/error.css';

function Error({ text }:{text:string}) {
  return (
    <Container>
      <Row>
        <Alert variant="danger" className="error">
          {text}
        </Alert>
      </Row>
    </Container>
  );
}

export default Error;
