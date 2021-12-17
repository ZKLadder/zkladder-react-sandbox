import React from 'react';
import { Card } from 'react-bootstrap';
import bodyStyle from '../styles/Body';

function NotConnected() {
  return (
    <Card className="mx-auto" style={bodyStyle.card}>
      <Card.Body className="mx-auto" style={bodyStyle.cardText}>
        Please connect your wallet
      </Card.Body>
    </Card>
  );
}

export default NotConnected;
