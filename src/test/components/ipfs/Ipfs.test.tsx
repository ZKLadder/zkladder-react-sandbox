import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { ipfsState, viewState } from '../../../state/ipfs';
import Ipfs from '../../../components/ipfs/Ipfs';

const mockInstance = jest.fn();

jest.mock('@zkladder/zkladder-sdk-ts', () => ({}));

const initializeAllDirectoriesState = (settings:any) => {
  settings.set(ipfsState, {
    exists: true,
    instance: mockInstance,
  });

  settings.set(viewState, {
    view: 'directoryView',
    cid: '',
    refreshCounter: 0,
  });
};

const initializeDirectoryExplorerState = (settings:any) => {
  settings.set(ipfsState, {
    exists: true,
    instance: mockInstance,
  });

  settings.set(viewState, {
    view: 'cidView',
    cid: 'Qm123456789',
    refreshCounter: 0,
  });
};

describe('Ipfs parent component', () => {
  test('All directories view', async () => {
    render(
      <RecoilRoot initializeState={initializeAllDirectoriesState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Ipfs />
        </React.Suspense>
      </RecoilRoot>,
    );
    await waitFor(() => {
      expect(screen.getByText('Pinned Directories')).toBeVisible();
    });
  });

  test('Directory Explorer view', async () => {
    render(
      <RecoilRoot initializeState={initializeDirectoryExplorerState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Ipfs />
        </React.Suspense>
      </RecoilRoot>,
    );
    await waitFor(() => {
      expect(screen.getByText('Viewing Directory ipfs://Qm123456789')).toBeVisible();
    });
  });
});
