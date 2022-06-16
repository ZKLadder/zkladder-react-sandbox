import React, { useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Routes, Route, Navigate } from 'react-router-dom';
import style from '../styles/body.module.css';
import Dashboard from './memberDashboard/Dashboard';
import Nft from './nft/Nft';
import Ipfs from './ipfs/Ipfs';
import Deploy from './deploy/Deploy';
import ManageProjects from './manageProjects/ManageProjects';
import { getContract } from '../utils/api';
import { walletState } from '../state/wallet';
import { contractsState } from '../state/contract';
import { contractRefreshCounter } from '../state/page';

function Body() {
  const refreshCounter = useRecoilValue(contractRefreshCounter);
  const setContracts = useSetRecoilState(contractsState);
  const { address } = useRecoilValue(walletState);

  // Prefetch all of the users deployed contracts
  useEffect(() => {
    async function getContracts() {
      const contractRecords = await getContract({ userAddress: address?.[0] });
      setContracts(contractRecords);
    }

    getContracts();
  }, [refreshCounter]);

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

        <Route path="projects" element={<ManageProjects />}>
          <Route
            path=":address"
            element={<ManageProjects />}
          />
        </Route>

        {/* Default Route */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </React.Suspense>
  );
}

export default Body;
