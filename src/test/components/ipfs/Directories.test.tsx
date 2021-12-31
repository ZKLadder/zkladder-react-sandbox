import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ipfsState, viewState } from '../../../state/ipfs';
import Directories from '../../../components/ipfs/Directories';

const mockGetPinned = jest.fn();
const mockRemoveFile = jest.fn();

const mockInstance = {
  getPinned: mockGetPinned,
  removeFile: mockRemoveFile,
};

const initializeIpfsState = (settings:any) => {
  settings.set(ipfsState, {
    instance: mockInstance,
    exists: true,
  });
};

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

describe('Directories component', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    mockGetPinned.mockResolvedValueOnce({ Keys: {} });
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Directories />
        </React.Suspense>
      </RecoilRoot>,
    );
    await waitFor(() => {
      expect(screen.getByText('Pinned Directories')).toBeVisible();
      expect(screen.getByText('Or enter a known directory CID')).toBeVisible();
      expect(screen.getByText('Lookup Directory')).toBeVisible();
      expect(screen.getByText('Upload files into a new directory')).toBeVisible();
    });
  });

  test('It correctly renders directory cards', async () => {
    mockGetPinned.mockResolvedValueOnce({
      Keys: {
        QmONE: { Type: 'recursive' },
        QmTWO: { Type: 'indirect' },
        QmTHREE: { Type: 'recursive' },
        QmFOUR: { Type: 'direct' },
        QmFIVE: { Type: 'recursive' },
      },
    });
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Directories />
        </React.Suspense>
      </RecoilRoot>,
    );

    // Wait one second for render
    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const deleteButtons = screen.queryAllByText('Delete Directory');

    await waitFor(() => {
      expect(screen.queryByTestId('QmONE')).toBeVisible();
      expect(screen.queryByTestId('QmTWO')).not.toBeInTheDocument();
      expect(screen.queryByTestId('QmTHREE')).toBeVisible();
      expect(screen.queryByTestId('QmFOUR')).not.toBeInTheDocument();
      expect(screen.queryByTestId('QmFIVE')).toBeVisible();
      expect(deleteButtons.length).toBe(3);
    });
  });

  test('Displays appropriate message when there are no pinned directories', async () => {
    mockGetPinned.mockResolvedValueOnce({
      Keys: {},
    });

    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Directories />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('No pinned directories')).toBeVisible();
    });
  });

  test('Clicking delete button correctly calls the Ipfs module', async () => {
    mockGetPinned.mockResolvedValueOnce({
      Keys: {
        QmONE: { Type: 'recursive' },
        QmTWO: { Type: 'recursive' },
        QmTHREE: { Type: 'recursive' },
      },
    });
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Directories />
        </React.Suspense>
      </RecoilRoot>,
    );

    // Wait one second for render
    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const deleteButtons = screen.queryAllByText('Delete Directory');

    const qmONE = deleteButtons[0];
    const qmTWO = deleteButtons[1];
    const qmTHREE = deleteButtons[2];

    await userEvent.click(qmONE);
    await waitFor(() => {
      expect(mockRemoveFile).toHaveBeenCalledWith('QmONE');
    });

    await userEvent.click(qmTWO);
    await waitFor(() => {
      expect(mockRemoveFile).toHaveBeenCalledWith('QmTWO');
    });

    await userEvent.click(qmTHREE);
    await waitFor(() => {
      expect(mockRemoveFile).toHaveBeenCalledWith('QmTHREE');
    });

    await waitFor(() => {
      expect(mockGetPinned).toHaveBeenCalledTimes(4);
    });
  });

  test('Clicking on the directory card correctly updates state', async () => {
    const viewStateObserver = jest.fn();
    mockGetPinned.mockResolvedValueOnce({
      Keys: {
        QmONE: { Type: 'recursive' },
      },
    });
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <RecoilObserver node={viewState} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <Directories />
        </React.Suspense>
      </RecoilRoot>,
    );

    // Wait one second for render
    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const directoryLink = screen.getByText('ipfs://QmONE');

    await userEvent.click(directoryLink);
    await waitFor(() => {
      expect(viewStateObserver).toHaveBeenCalledTimes(2);
      expect(viewStateObserver).toHaveBeenCalledWith({ cid: '', refreshCounter: 0, view: 'directoryView' });
      expect(viewStateObserver).toHaveBeenCalledWith({ cid: 'QmONE', refreshCounter: 0, view: 'cidView' });
    });
  });

  test('It correctly displays API errors', async () => {
    mockGetPinned.mockRejectedValue({ message: 'Test api error' });
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Directories />
        </React.Suspense>
      </RecoilRoot>,
    );
    await waitFor(() => {
      expect(screen.getByText('Test api error')).toBeVisible();
    });
  });
});
