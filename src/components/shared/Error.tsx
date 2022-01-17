import React from 'react';
import {
  Alert, Container, Row,
} from 'react-bootstrap';

function Loading({ text }:{text:string}) {
  return (
    <Container>
      <Row>
        <Alert variant="danger" className="mx-auto" style={{ marginTop: '30px' }}>
          {text}
        </Alert>
      </Row>
    </Container>
  );
}

export default Loading;
