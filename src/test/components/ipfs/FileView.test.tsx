import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { ipfsState } from '../../../state/ipfs';
import FileView from '../../../components/ipfs/FileView';

const mockShowDirectory = jest.fn();
const mockInstance = {
  showDirectory: mockShowDirectory,
};

const initializeIpfsState = (settings:any) => {
  settings.set(ipfsState, {
    instance: mockInstance,
    exists: true,
  });
};

describe('FileView component', () => {
  beforeEach(() => {
    // Silence react unique key errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It correctly displays image files', async () => {
    mockShowDirectory.mockResolvedValueOnce([
      {
        Name: 'first.jpg',
        Hash: 'qmFIRST',
        gatewayUrl: 'ipfs.first.jpg',
      },
      {
        Name: 'second.Jpg',
        Hash: 'qmSECOND',
        gatewayUrl: 'ipfs.second.jpg',
      },
      {
        Name: 'third.pNg',
        Hash: 'qmTHIRD',
        gatewayUrl: 'ipfs.third.jpg',
      },
    ]);
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <FileView />
        </React.Suspense>
      </RecoilRoot>,
    );
    await waitFor(() => {
      // FileNames are visible
      expect(screen.getByText('first.jpg')).toBeVisible();
      expect(screen.getByText('second.Jpg')).toBeVisible();
      expect(screen.getByText('third.pNg')).toBeVisible();

      // Ipfs Hashes are visible
      expect(screen.getByText('ipfs://qmFIRST')).toBeVisible();
      expect(screen.getByText('ipfs://qmSECOND')).toBeVisible();
      expect(screen.getByText('ipfs://qmTHIRD')).toBeVisible();

      // Images are rendered with the correct source
      expect(screen.getByTestId('qmFIRST')).toHaveAttribute('src', 'https://ipfs.first.jpg');
      expect(screen.getByTestId('qmSECOND')).toHaveAttribute('src', 'https://ipfs.second.jpg');
      expect(screen.getByTestId('qmTHIRD')).toHaveAttribute('src', 'https://ipfs.third.jpg');
    });
  });

  test('It correctly displays non-image files', async () => {
    mockShowDirectory.mockResolvedValueOnce([
      {
        Name: 'first.txt',
        Hash: 'qmFIRST',
        gatewayUrl: 'ipfs.first.txt',
      },
      {
        Name: 'second.json',
        Hash: 'qmSECOND',
        gatewayUrl: 'ipfs.second.json',
      },
      {
        Name: 'third.doc',
        Hash: 'qmTHIRD',
        gatewayUrl: 'ipfs.third.doc',
      },
    ]);
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <FileView />
        </React.Suspense>
      </RecoilRoot>,
    );
    await waitFor(() => {
      // FileNames are visible
      expect(screen.getByText('first.txt')).toBeVisible();
      expect(screen.getByText('second.json')).toBeVisible();
      expect(screen.getByText('third.doc')).toBeVisible();

      // Ipfs Hashes are visible
      expect(screen.getByText('ipfs://qmFIRST')).toBeVisible();
      expect(screen.getByText('ipfs://qmSECOND')).toBeVisible();
      expect(screen.getByText('ipfs://qmTHIRD')).toBeVisible();

      // Images are rendered with the correct source
      expect(screen.getByTestId('qmFIRST-file')).toBeVisible();
      expect(screen.getByTestId('qmSECOND-file')).toBeVisible();
      expect(screen.getByTestId('qmTHIRD-file')).toBeVisible();
    });
  });

  test('It correctly displays API errors', async () => {
    mockShowDirectory.mockRejectedValue({ message: 'Test api error' });
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <FileView />
        </React.Suspense>
      </RecoilRoot>,
    );
    await waitFor(() => {
      expect(screen.queryByText('first.txt')).not.toBeInTheDocument();
      expect(screen.queryByText('second.json')).not.toBeInTheDocument();
      expect(screen.queryByText('third.doc')).not.toBeInTheDocument();

      expect(screen.queryByText('ipfs://qmFIRST')).not.toBeInTheDocument();
      expect(screen.queryByText('ipfs://qmSECOND')).not.toBeInTheDocument();
      expect(screen.queryByText('ipfs://qmTHIRD')).not.toBeInTheDocument();

      expect(screen.queryByText('qmFIRST-file')).not.toBeInTheDocument();
      expect(screen.queryByText('qmSECOND-file')).not.toBeInTheDocument();
      expect(screen.queryByText('qmTHIRD-file')).not.toBeInTheDocument();

      expect(screen.getByText('Test api error')).toBeVisible();
    });
  });
});
