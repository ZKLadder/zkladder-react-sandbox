import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import bodyStyle from '../styles/body';
// import Nft from './nft/Nft';
import Ipfs from './ipfs/Ipfs';
// Routing logic happens in this component

function Body() {
  return (
    <Card className="mx-auto" style={bodyStyle.card}>
      <Card.Body style={bodyStyle.cardText}>
        <React.Suspense fallback={<Spinner animation="border" role="status" />}>
          {/* @TODO Return module showcase components depending on current route when isConnected == true */}
          <Ipfs />
        </React.Suspense>
      </Card.Body>
    </Card>
  );
}

export default Body;
