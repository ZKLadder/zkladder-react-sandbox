import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadAssets from '../../../../../components/manageProjects/memberNftV2/drops/UploadAssets';
import { currentDropState } from '../../../../../state/drop';
import { mockMemberNftInstance } from '../../../../mocks';
import { contractsState, selectedContractState } from '../../../../../state/contract';
import { walletState } from '../../../../../state/wallet';
import { getDrops, deleteAssets } from '../../../../../utils/api';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNftV2: {
    setup: () => (mockMemberNftInstance),
  },
}));

jest.mock('../../../../../utils/api', () => ({
  getDrops: jest.fn(),
  updateDrop: jest.fn(),
  deleteAssets: jest.fn(),
}));

jest.mock('../../../../../components/manageProjects/memberNftV2/drops/UploadAssetModal', () => ({
  __esModule: true,
  default: ({ show }:{show:boolean}) => <p>{show ? 'MODAL OPEN' : 'MODAL CLOSED'}</p>,
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
const mockDeleteAssets = deleteAssets as jest.Mocked<any>;

describe('UploadAssets component tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders with no assets', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);

    render(
      <RecoilRoot initializeState={initializeEmptyState}>
        <UploadAssets />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('ASSETS UPLOADED:')).toBeVisible();
      expect(screen.getByText('UPLOAD MORE')).toBeVisible();
      expect(screen.getByText('No assets uploaded yet')).toBeVisible();
    });
  });

  test('Assets are properly deleted', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
    mockGetDrops.mockResolvedValue([{ mock: 'new asset', assets: [] }]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <UploadAssets />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MOCK ASSET URI')).toBeVisible();
    });

    await userEvent.click(screen.getByTestId('1111-delete'));

    await waitFor(() => {
      expect(mockDeleteAssets).toHaveBeenCalledWith({
        assetIds: [1111],
      });

      expect(mockGetDrops).toHaveBeenCalledWith({
        id: 234,
      });
    });
  });

  test('Clicking upload button opens modal', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);

    render(
      <RecoilRoot initializeState={initializeState}>
        <UploadAssets />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MODAL CLOSED')).toBeVisible();
      expect(screen.getByText('MOCK ASSET URI')).toBeVisible();
    });

    await userEvent.click(screen.getByText('UPLOAD MORE'));

    await waitFor(() => {
      expect(screen.getByText('MODAL OPEN')).toBeVisible();
    });
  });
});
