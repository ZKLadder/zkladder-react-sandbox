import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigureDrop from '../../../../../components/manageProjects/memberNftV2/drops/ConfigureDrop';
import { currentDropState } from '../../../../../state/page';
import { mockMemberNftInstance } from '../../../../mocks';
import { contractsState, selectedContractState } from '../../../../../state/contract';
import { walletState } from '../../../../../state/wallet';
import { updateDrop, getDrops } from '../../../../../utils/api';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNftV2: {
    setup: () => (mockMemberNftInstance),
  },
}));

jest.mock('../../../../../utils/api', () => ({
  getDrops: jest.fn(),
  updateDrop: jest.fn(),
}));

const contracts = [
  { address: '0xselectedContract', chainId: '1', templateId: '3' },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract', chainId: '1', templateId: '3' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(currentDropState, {
    id: 234, name: 'A NEW DROP', tierId: 0,
  });
};

const initializeEmptyState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract', chainId: '1', templateId: '3' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(currentDropState, {
    id: 234, name: '', tierId: 0,
  });
};

const mockUpdateDrop = updateDrop as jest.Mocked<any>;
const mockGetDrops = getDrops as jest.Mocked<any>;

describe('ConfigureDrop component tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);

    render(
      <RecoilRoot initializeState={initializeState}>
        <ConfigureDrop />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MEMBERSHIP TIER')).toBeVisible();
      expect(screen.getByText('TEST TIER')).toBeVisible();
      expect(screen.getByText('DROP NAME (Optional)')).toBeVisible();
      expect(screen.getByText('DROP NAME (Optional)')).toBeVisible();
      expect(screen.getByText('MINTING OPENS')).toBeVisible();
      expect(screen.getByText('MINTING CLOSES')).toBeVisible();
    });
  });

  test('Editing drop correctly calls API', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
    mockGetDrops.mockResolvedValue([{}]);
    render(
      <RecoilRoot initializeState={initializeEmptyState}>
        <ConfigureDrop />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByText('TEST TIER'));
    await userEvent.click(screen.getByText('A SECOND TIER'));
    await userEvent.type(screen.getByTestId('dropName'), 'New name');

    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await waitFor(() => {
      expect(mockUpdateDrop).toHaveBeenCalledWith({
        id: 234,
        tierId: 1,
        name: 'New name',
      });

      expect(mockGetDrops).toHaveBeenCalledWith({
        id: 234,
      });
    });
  });
});
