import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import style from '../styles/body.module.css';
import Dashboard from './memberDashboard/Dashboard';
import Nft from './nft/Nft';
import Ipfs from './ipfs/Ipfs';
import Deploy from './deploy/Deploy';

function Body() {
  return (
    <React.Suspense fallback={<Spinner animation="border" role="status" />}>
      <Routes>
        <Route
          path="ipfs"
          element={(
            <Card className={`mx-auto ${style['body-card']}`}>
              <Card.Body className={`mx-auto ${style['body-cardText']}`}>
                <Ipfs />
              </Card.Body>
            </Card>
            )}
        />
        <Route
          path="nft"
          element={(
            <Card className={`mx-auto ${style['body-card']}`}>
              <Card.Body className={`mx-auto ${style['body-cardText']}`}>
                <Nft />
              </Card.Body>
            </Card>
              )}
        />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="deploy"
          element={<Deploy />}
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </React.Suspense>
  );
}

export default Body;
