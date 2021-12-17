import React from 'react';
import { useRecoilValue } from 'recoil';
import { Card } from 'react-bootstrap';
import NotConnected from './NotConnected';
import { walletState } from '../state/wallet';
import bodyStyle from '../styles/Body';

function Body() {
  const { isConnected } = useRecoilValue(walletState);
  return (
    // @TODO Return module showcase components depending on current route when isConnected == true
    isConnected
      ? (
        <Card className="mx-auto" style={bodyStyle.card}>
          <Card.Body className="mx-auto" style={bodyStyle.cardText}>
            You are now connected
          </Card.Body>
        </Card>
      )
      : <NotConnected />
  );
}

export default Body;
