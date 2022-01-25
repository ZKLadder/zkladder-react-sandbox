import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import bodyStyle from '../styles/body';
import Nft from './nft/Nft';
import Ipfs from './ipfs/Ipfs';
import DeployMemberNft from './memberNft/Deploy';

function Body() {
  return (
    <Card className="mx-auto" style={bodyStyle.card}>
      <Card.Body style={bodyStyle.cardText}>
        <React.Suspense fallback={<Spinner animation="border" role="status" />}>
          <Routes>
            <Route
              path="deploy-nft"
              element={<DeployMemberNft />}
            />
            <Route
              path="ipfs"
              element={<Ipfs />}
            />
            <Route
              path="nft"
              element={<Nft />}
            />

            {/* Default Route */}
            <Route path="*" element={<Navigate to="deploy-nft" replace />} />
          </Routes>
        </React.Suspense>
      </Card.Body>
    </Card>
  );
}

export default Body;
