import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ipfsState, viewState } from '../../../state/ipfs';
import FileUpload from '../../../components/ipfs/FileUpload';

const mockAddFiles = jest.fn();
const mockAddFilesToDirectory = jest.fn();

const mockInstance = {
  addFiles: mockAddFiles,
  addFilesToDirectory: mockAddFilesToDirectory,
};

const initializeIpfsState = (settings:any) => {
  settings.set(ipfsState, {
    instance: mockInstance,
    exists: true,
  });

  settings.set(viewState, {
    view: 'cidView',
    cid: 'Qm1234',
    refreshCounter: 0,
  });
};

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

describe('FileUpload component', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <FileUpload createNewDirectory={false} />
        </React.Suspense>
      </RecoilRoot>,
    );
    await waitFor(() => {
      expect(screen.getByText('Drag and drop a file or directory')).toBeVisible();
    });
  });

  test('File upload to new directory workflow', async () => {
    const viewStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <RecoilObserver node={viewState} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <FileUpload createNewDirectory />
        </React.Suspense>
      </RecoilRoot>,
    );

    const fileInput = screen.getByTestId('fileInput');

    const mockFile = new File(['file'], 'mockData.png', {
      type: 'image/png',
    });

    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
    });

    await fireEvent.drop(fileInput);

    const uploadButton = screen.getByText('Upload files to IPFS');
    const clearButton = screen.getByText('Clear Selection');

    await waitFor(() => {
      expect(screen.getByText('mockData.png')).toBeVisible();
      expect(uploadButton).toBeVisible();
      expect(clearButton).toBeVisible();
    });

    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockAddFiles).toHaveBeenCalledWith([
        {
          file: mockFile,
          fileName: 'mockData.png',
        },
      ]);
      expect(viewStateObserver).toHaveBeenCalledWith({
        view: 'cidView',
        cid: 'Qm1234',
        refreshCounter: 1,
      });
    });
  });

  test('File upload to existing directory workflow', async () => {
    const viewStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <RecoilObserver node={viewState} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <FileUpload createNewDirectory={false} />
        </React.Suspense>
      </RecoilRoot>,
    );

    const fileInput = screen.getByTestId('fileInput');

    const mockFile = new File(['file'], 'mockData.png', {
      type: 'image/png',
    });

    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
    });

    await fireEvent.drop(fileInput);

    const uploadButton = screen.getByText('Upload files to IPFS');
    const clearButton = screen.getByText('Clear Selection');

    await waitFor(() => {
      expect(screen.getByText('mockData.png')).toBeVisible();
      expect(uploadButton).toBeVisible();
      expect(clearButton).toBeVisible();
    });

    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockAddFilesToDirectory).toHaveBeenCalledWith([
        {
          file: mockFile,
          fileName: 'mockData.png',
        },
      ], 'Qm1234');
      expect(viewStateObserver).toHaveBeenCalledWith({
        view: 'cidView',
        cid: 'Qm1234',
        refreshCounter: 1,
      });
    });
  });

  test('Errors are displayed correctly', async () => {
    const viewStateObserver = jest.fn();
    mockAddFiles.mockRejectedValueOnce({ message: 'Test upload error' });
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <RecoilObserver node={viewState} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <FileUpload createNewDirectory />
        </React.Suspense>
      </RecoilRoot>,
    );

    const fileInput = screen.getByTestId('fileInput');

    const mockFile = new File(['file'], 'mockData.png', {
      type: 'image/png',
    });

    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
    });

    await fireEvent.drop(fileInput);

    const uploadButton = screen.getByText('Upload files to IPFS');
    const clearButton = screen.getByText('Clear Selection');

    await waitFor(() => {
      expect(screen.getByText('mockData.png')).toBeVisible();
      expect(uploadButton).toBeVisible();
      expect(clearButton).toBeVisible();
    });

    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Test upload error')).toBeVisible();
    });
  });

  test('Clear added files flow', async () => {
    const viewStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeIpfsState}>
        <RecoilObserver node={viewState} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <FileUpload createNewDirectory />
        </React.Suspense>
      </RecoilRoot>,
    );

    const fileInput = screen.getByTestId('fileInput');

    const mockFile = new File(['file'], 'mockData.png', {
      type: 'image/png',
    });

    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
    });

    await fireEvent.drop(fileInput);

    const uploadButton = screen.getByText('Upload files to IPFS');
    const clearButton = screen.getByText('Clear Selection');

    await waitFor(() => {
      expect(screen.getByText('mockData.png')).toBeVisible();
      expect(uploadButton).toBeVisible();
      expect(clearButton).toBeVisible();
    });

    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByText('mockData.png')).not.toBeInTheDocument();
      expect(screen.queryByText('Upload files to IPFS')).not.toBeInTheDocument();
      expect(screen.queryByText('Clear Selection')).not.toBeInTheDocument();
    });
  });
});
