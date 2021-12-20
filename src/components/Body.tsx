import React from 'react';
import { useRecoilValue } from 'recoil';
import { Card, Spinner } from 'react-bootstrap';
import NotConnected from './NotConnected';
import { walletState } from '../state/wallet';
import bodyStyle from '../styles/body';
import Nft from './nft/Nft';
// Routing logic happens in this component

function Body() {
  const { isConnected } = useRecoilValue(walletState);
  return (

    isConnected
      ? (
        <Card className="mx-auto" style={bodyStyle.card}>
          <Card.Body style={bodyStyle.cardText}>
            <React.Suspense fallback={<Spinner animation="border" role="status" />}>
              {/* @TODO Return module showcase components depending on current route when isConnected == true */}
              <Nft />
            </React.Suspense>
          </Card.Body>
        </Card>
      )
      : <NotConnected />
  );
}

export default Body;
