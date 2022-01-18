import React from 'react';
import {
  Spinner, Container, Row,
} from 'react-bootstrap';

function Loading({ text }:{text?:string}) {
  return (
    <Container>
      <Row>
        <Spinner data-testid="loadingSpinner" className="mx-auto" style={{ marginTop: '30px' }} animation="border" role="status" />
      </Row>
      <Row>
        <p className="mx-auto" style={{ marginTop: '15px', textAlign: 'center' }}>{text}</p>
      </Row>
    </Container>
  );
}

Loading.defaultProps = {
  text: '',
};

export default Loading;
