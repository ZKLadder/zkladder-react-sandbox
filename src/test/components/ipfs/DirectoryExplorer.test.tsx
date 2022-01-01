import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ipfsState, viewState } from '../../../state/ipfs';
import DirectoryExplorer from '../../../components/ipfs/DirectoryExplorer';

const mockShowDirectory = jest.fn();
const mockInstance = {
  showDirectory: mockShowDirectory,
};

const initializeIpfsState = (settings:any) => {
  settings.set(ipfsState, {
    instance: mockInstance,
    exists: true,
  });

  settings.set(viewState, {
    view: 'cidView',
    cid: 'Qm123456789',
    refreshCounter: 0,
  });
};

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

describe('DirectoryExplorer component', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    mockShowDirectory.mockResolvedValueOnce([]);
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <DirectoryExplorer />
        </React.Suspense>
      </RecoilRoot>,
    );
    await waitFor(() => {
      expect(screen.getByText('Viewing Directory ipfs://Qm123456789')).toBeVisible();
      expect(screen.getByText('Back to Directory Select')).toBeVisible();
      expect(screen.getByText('Add files (this will change the directory CID)')).toBeVisible();
    });
  });

  test('The back button correctly updates state', async () => {
    const viewStateObserver = jest.fn();
    mockShowDirectory.mockResolvedValueOnce([]);
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <RecoilObserver node={viewState} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <DirectoryExplorer />
        </React.Suspense>
      </RecoilRoot>,
    );
    const backButton = screen.getByTestId('backButton');

    await userEvent.click(backButton);

    await waitFor(() => {
      expect(viewStateObserver).toHaveBeenCalledTimes(2);
      expect(viewStateObserver).toHaveBeenCalledWith({ cid: 'Qm123456789', refreshCounter: 0, view: 'cidView' });
      expect(viewStateObserver).toHaveBeenCalledWith({ cid: '', refreshCounter: 0, view: 'directoryView' });
    });
  });
});
