import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManageDrop from '../../../../../components/manageProjects/memberNftV2/drops/ManageDrop';
import { dropSectionState } from '../../../../../state/page';
import { mockMemberNftInstance, RecoilObserver } from '../../../../mocks';
import { contractsState, selectedContractState } from '../../../../../state/contract';
import { walletState } from '../../../../../state/wallet';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNftV2: {
    setup: () => (mockMemberNftInstance),
  },
}));

jest.mock('../../../../../components/manageProjects/memberNftV2/drops/ConfigureDrop', () => ({
  __esModule: true,
  default: () => <p>CONFIGURE DROP COMPONENT</p>,
}));

jest.mock('../../../../../components/manageProjects/memberNftV2/drops/UploadAssets', () => ({
  __esModule: true,
  default: () => <p>UPLOAD ASSETS COMPONENT</p>,
}));

jest.mock('../../../../../components/manageProjects/memberNftV2/drops/MintWidget', () => ({
  __esModule: true,
  default: () => <p>MINT WIDGET COMPONENT</p>,
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

describe('ManageDrop component tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);

    render(
      <RecoilRoot initializeState={initializeState}>
        <ManageDrop />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('CONFIGURE DROP')).toBeVisible();
      expect(screen.getByText('UPLOAD ASSETS')).toBeVisible();
      expect(screen.getByText('MINT WIDGET')).toBeVisible();
    });
  });

  test('Clicking tab items correctly updates state', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);

    render(
      <RecoilRoot initializeState={initializeState}>
        <ManageDrop />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('CONFIGURE DROP COMPONENT')).toBeVisible();
    });

    await userEvent.click(screen.getByText('UPLOAD ASSETS'));

    await waitFor(() => {
      expect(screen.getByText('UPLOAD ASSETS COMPONENT')).toBeVisible();
    });

    await userEvent.click(screen.getByText('MINT WIDGET'));

    await waitFor(() => {
      expect(screen.getByText('MINT WIDGET COMPONENT')).toBeVisible();
    });
  });

  test('Clicking cancel button correctly updates state', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
    const dropSectionObserver = jest.fn();

    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={dropSectionState} onChange={dropSectionObserver} />
        <ManageDrop />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByText('GO BACK'));

    await waitFor(() => {
      expect(dropSectionObserver).toHaveBeenCalledWith('dropTable');
    });
  });
});
