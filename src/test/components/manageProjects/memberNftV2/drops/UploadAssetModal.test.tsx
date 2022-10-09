import React from 'react';
import { RecoilRoot } from 'recoil';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import UploadAssetModal from '../../../../../components/manageProjects/memberNftV2/drops/UploadAssetModal';
import { currentDropState } from '../../../../../state/drop';
import { mockMemberNftInstance, mockIpfsInstance } from '../../../../mocks';
import { contractsState, selectedContractState } from '../../../../../state/contract';
import { walletState } from '../../../../../state/wallet';
import { getDrops, uploadAssets } from '../../../../../utils/api';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(),
  MemberNftV2: {
    setup: () => (mockMemberNftInstance),
  },
}));

jest.mock('../../../../../utils/api', () => ({
  getDrops: jest.fn(),
  updateDrop: jest.fn(),
  deleteAssets: jest.fn(),
  uploadAssets: jest.fn(),
}));

const contracts = [
  { address: '0xselectedContract', chainId: '1', templateId: '3' },
];

const initializeEmptyState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract', chainId: '1', templateId: '3' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(currentDropState, {
    id: 234, name: '', tierId: 0, assets: [],
  });
};

const initializeState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract', chainId: '1', templateId: '3' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(currentDropState, {
    id: 234,
    name: 'A NEW DROP',
    tierId: 0,
    assets: [{
      id: 1111, tokenUri: 'MOCK ASSET URI', dropId: 123, minted: false,
    }],
  });
};

const mockGetDrops = getDrops as jest.Mocked<any>;
const mockUploadAssets = uploadAssets as jest.Mocked<any>;

describe('UploadAssetModal component tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});

    (Ipfs as jest.Mocked<any>).mockImplementation(() => (mockIpfsInstance));
  });

  test('It renders', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);

    render(
      <RecoilRoot initializeState={initializeEmptyState}>
        <UploadAssetModal show onHide={() => {}} />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Upload Files (Max 500 at a Time)')).toBeVisible();
    });
  });

  test('Upload assets workflow', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
    mockGetDrops.mockResolvedValue([{ mock: 'new asset', assets: [] }]);
    mockIpfsInstance.addFiles.mockResolvedValueOnce([
      { Hash: 'HASH 1' },
      { Hash: 'HASH 2' },
      { Hash: '' },
    ]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <UploadAssetModal show onHide={() => {}} />
      </RecoilRoot>,
    );

    const fileInput = screen.getByTestId('fileInput');

    const mockFile = new File([JSON.stringify({ mock: 'data' })], 'mockJson.json', {
      type: 'application/json',

    });

    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
    });

    await fireEvent.drop(fileInput);

    const uploadButton = screen.getByText('UPLOAD');

    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockUploadAssets).toHaveBeenCalledWith({
        assets: [
          {
            dropId: 234,
            tokenUri: 'ipfs://HASH 1',
          },
          {
            dropId: 234,
            tokenUri: 'ipfs://HASH 2',
          },
        ],
        contractAddress: '0xselectedContract',
        chainId: '1',
      });

      expect(getDrops).toHaveBeenCalledWith({
        id: 234,
        contractAddress: '0xselectedContract',
        chainId: '1',
      });
    });
  });
});

test('Clicking close button closes the modal', async () => {
  mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
  const closeModal = jest.fn();
  render(
    <RecoilRoot initializeState={initializeState}>
      <UploadAssetModal show onHide={closeModal} />
    </RecoilRoot>,
  );

  const closeButton = screen.getByText('CLOSE');

  await userEvent.click(closeButton);

  await waitFor(() => {
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
