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
import PageBody from './shared/PageBody';
import Navbar from './navbar/Navbar';
import Dashboard from './authenticated/dashboard/Dashboard';

function Body() {
  return (
    <PageBody color={{ start: '#16434B', end: '#4EB9B1' }}>

      {/* Navbar */}
      <Navbar variant="authenticated" />

      {/* Page Contents */}
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
    </PageBody>
  );
}

export default Body;
