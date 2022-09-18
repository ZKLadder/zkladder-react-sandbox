import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropTable from '../../../../../components/manageProjects/memberNftV2/drops/DropTable';
import { dropSectionState } from '../../../../../state/page';
import { currentDropState } from '../../../../../state/drop';
import { mockMemberNftInstance, RecoilObserver } from '../../../../mocks';
import { contractsState, selectedContractState } from '../../../../../state/contract';
import { walletState } from '../../../../../state/wallet';
import { createDrop, getDrops } from '../../../../../utils/api';
import { nftContractUpdates } from '../../../../../state/nftContract';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNftV2: {
    setup: () => (mockMemberNftInstance),
  },
}));

jest.mock('../../../../../utils/api', () => ({
  createDrop: jest.fn(),
  getDrops: jest.fn(),
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
};

const initializeUpdatesState = (settings:any) => {
  settings.set(selectedContractState, { address: '0xselectedContract', chainId: '1', templateId: '3' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(nftContractUpdates, {
    voucherServiceToggle: true,
  });
};

const mockCreateDrop = createDrop as jest.Mocked<any>;
const mockGetDrops = getDrops as jest.Mocked<any>;

describe('DropTable component tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders with no drops', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 'TEST TIER' }]);
    mockGetDrops.mockResolvedValueOnce([]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <DropTable />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Active Drops')).toBeVisible();
      expect(screen.getByText('Upcoming Drops')).toBeVisible();
      expect(screen.getByText('SCHEDULE A NEW DROP')).toBeVisible();
      expect(screen.getByText('MINT A SINGLE NFT')).toBeVisible();
      expect(screen.getByText('No drops created yet')).toBeVisible();
    });
  });

  test('It renders with drops', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 'TEST TIER' }]);
    mockGetDrops.mockResolvedValueOnce([{ id: 1, name: 'MOCKDROP' }]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <DropTable />
      </RecoilRoot>,
    );

    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await waitFor(() => {
      expect(screen.getByText('Active Drops')).toBeVisible();
      expect(screen.getByText('Upcoming Drops')).toBeVisible();
      expect(screen.getByText('SCHEDULE A NEW DROP')).toBeVisible();
      expect(screen.getByText('MINT A SINGLE NFT')).toBeVisible();
      expect(screen.getByText('DROP NAME')).toBeVisible();
      expect(screen.getByText('MOCKDROP')).toBeVisible();
    });
  });

  test('Activate drop service correctly updates state when service is OFF', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 'TEST TIER' }]);
    mockGetDrops.mockResolvedValueOnce([{ id: 1, name: 'MOCKDROP' }]);
    const updatesObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={nftContractUpdates} onChange={updatesObserver} />
        <DropTable />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('activateVouchers'));

    await waitFor(() => {
      expect(updatesObserver).toHaveBeenCalledWith({ voucherServiceToggle: true });
    });
  });

  test('Activate drop service correctly updates state when service is ON', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 'TEST TIER' }]);
    mockGetDrops.mockResolvedValueOnce([{ id: 1, name: 'MOCKDROP' }]);
    const updatesObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeUpdatesState}>
        <RecoilObserver node={nftContractUpdates} onChange={updatesObserver} />
        <DropTable />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('activateVouchers'));

    await waitFor(() => {
      expect(updatesObserver).toHaveBeenCalledWith({ voucherServiceToggle: false });
    });
  });

  test('Mint button correctly updates state', async () => {
    const dropSectionObserver = jest.fn();
    mockGetDrops.mockResolvedValueOnce([]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={dropSectionState} onChange={dropSectionObserver} />
        <DropTable />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByText('MINT A SINGLE NFT'));

    await waitFor(() => {
      expect(dropSectionObserver).toHaveBeenCalledWith('airDrop');
    });
  });

  test('New drop button correctly updates state', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 'TEST TIER' }]);
    mockCreateDrop.mockResolvedValue({ mock: 'drop' });
    mockGetDrops.mockResolvedValueOnce([]);
    const dropSectionObserver = jest.fn();
    const currentDropObserver = jest.fn();

    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={currentDropState} onChange={currentDropObserver} />
        <RecoilObserver node={dropSectionState} onChange={dropSectionObserver} />
        <DropTable />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByText('SCHEDULE A NEW DROP'));

    await waitFor(() => {
      expect(mockCreateDrop).toHaveBeenCalledWith({
        contractAddress: '0xselectedContract',
        chainId: '1',
        tierId: 'TEST TIER',
      });
      expect(dropSectionObserver).toHaveBeenCalledWith('manageDrop');
      expect(currentDropObserver).toHaveBeenCalledWith({ mock: 'drop' });
    });
  });
});
