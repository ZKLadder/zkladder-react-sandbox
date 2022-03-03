import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import '../styles/body.css';
import Nft from './nft/Nft';
import Ipfs from './ipfs/Ipfs';
import DeployMemberNft from './memberNft/Deploy';
import Dashboard from './memberDashboard/Dashboard';

function Body() {
  return (
    <React.Suspense fallback={<Spinner animation="border" role="status" />}>
      <Routes>
        <Route
          path="deploy-nft"
          element={(
            <Card className="mx-auto body-card">
              <Card.Body className="mx-auto body-cardText">
                <DeployMemberNft />
              </Card.Body>
            </Card>
                )}
        />
        <Route
          path="ipfs"
          element={(
            <Card className="mx-auto body-card">
              <Card.Body className="mx-auto body-cardText">
                <Ipfs />
              </Card.Body>
            </Card>
            )}
        />
        <Route
          path="nft"
          element={(
            <Card className="mx-auto body-card">
              <Card.Body className="mx-auto body-cardText">
                <Nft />
              </Card.Body>
            </Card>
              )}
        />
        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </React.Suspense>
  );
}

export default Body;
