import React from 'react';
import {
  Alert, Container, Row,
} from 'react-bootstrap';

function Error({ text }:{text:string}) {
  return (
    <Container>
      <Row>
        <Alert variant="danger" style={{ marginTop: '30px' }}>
          {text}
        </Alert>
      </Row>
    </Container>
  );
}

export default Error;
