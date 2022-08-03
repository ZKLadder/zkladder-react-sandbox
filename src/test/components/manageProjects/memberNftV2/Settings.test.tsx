import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';
import Settings from '../../../../components/manageProjects/memberNftV2/Settings';
import { selectedContractState, contractsState } from '../../../../state/contract';
import { nftContractUpdates } from '../../../../state/nftContract';
import { mockMemberNftInstance, RecoilObserver } from '../../../mocks';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNftV2: {
    setup: () => (mockMemberNftInstance),
  },
  utilities: { isEthereumAddress: (val:any) => (val) },
}));

const contracts = [
  {
    address: '0xselectedContract', chainId: '4', whitelisted: 2000, templateId: '3',
  },
];

const initializeState = (settings:any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(nftContractUpdates, {
    description: 'AN UPDATED DESCRIPTION',
    beneficiaryAddress: '0xAnUpdatedAddress',
  });
};

const initializeEmptyState = (settings:any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
};

describe('Settings component tests', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('It renders', async () => {
    mockMemberNftInstance.getCollectionMetadata.mockResolvedValueOnce({
      name: 'MOCK CONTRACT SETTINGS',
      symbol: 'MCS',
      description: 'MOCK DESCRIPTION',
      external_link: 'MOCK WEB URL',
    });
    mockMemberNftInstance.beneficiaryAddress.mockResolvedValueOnce('0x123456789');

    const { unmount } = render(
      <RecoilRoot initializeState={initializeEmptyState}>
        <Settings />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('COMMUNITY NAME')).toBeVisible();
      expect(screen.getByText('CONTRACT SYMBOL')).toBeVisible();
      expect(screen.getByText('COMMUNITY WEB URL')).toBeVisible();
      expect(screen.getByText('DESCRIPTION')).toBeVisible();
      expect(screen.getByText('BENEFICIARY ADDRESS')).toBeVisible();
      expect(screen.getByDisplayValue('MOCK CONTRACT SETTINGS')).toBeVisible();
      expect(screen.getByDisplayValue('MCS')).toBeVisible();
      expect(screen.getByDisplayValue('MOCK WEB URL')).toBeVisible();
      expect(screen.getByDisplayValue('MOCK DESCRIPTION')).toBeVisible();
      expect(screen.getByDisplayValue('0x123456789')).toBeVisible();
    });

    unmount();
  });

  test('It renders with updates', async () => {
    mockMemberNftInstance.getCollectionMetadata.mockResolvedValueOnce({
      name: 'MOCK CONTRACT SETTINGS',
      symbol: 'MCS',
      description: 'MOCK DESCRIPTION',
    });
    mockMemberNftInstance.royaltyBasis.mockResolvedValueOnce(500);
    mockMemberNftInstance.beneficiaryAddress.mockResolvedValueOnce('0x123456789');

    const { unmount } = render(
      <RecoilRoot initializeState={initializeState}>
        <Settings />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('COMMUNITY NAME')).toBeVisible();
      expect(screen.getByText('CONTRACT SYMBOL')).toBeVisible();
      expect(screen.getByText('COMMUNITY WEB URL')).toBeVisible();
      expect(screen.getByText('DESCRIPTION')).toBeVisible();
      expect(screen.getByText('BENEFICIARY ADDRESS')).toBeVisible();
      expect(screen.getByDisplayValue('MOCK CONTRACT SETTINGS')).toBeVisible();
      expect(screen.getByDisplayValue('MCS')).toBeVisible();
      expect(screen.getByDisplayValue('MOCK WEB URL')).toBeVisible();
      expect(screen.getByDisplayValue('AN UPDATED DESCRIPTION')).toBeVisible();
      expect(screen.getByDisplayValue('0xAnUpdatedAddress')).toBeVisible();
    });
    unmount();
  });

  test('Changes correctly update state', async () => {
    const contractUpdatesObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeEmptyState}>
        <RecoilObserver node={nftContractUpdates} onChange={contractUpdatesObserver} />
        <Settings />
      </RecoilRoot>,
    );

    userEvent.type(screen.getByTestId('description'), 'TYPED DESCRIPTION');
    userEvent.type(screen.getByTestId('beneficiary'), 'TYPED BENEFICIARY');
    userEvent.type(screen.getByTestId('link'), 'TYPED LINK');

    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith({
        description: 'MOCK DESCRIPTIONTYPED DESCRIPTION',
        external_link: 'MOCK WEB URLTYPED LINK',
        beneficiaryAddress: '0x123456789TYPED BENEFICIARY',
      });
    });
  });
});
