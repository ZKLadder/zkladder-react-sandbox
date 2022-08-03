import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';
import Tiers from '../../../../components/manageProjects/memberNftV2/Tiers';
import { selectedContractState, contractsState } from '../../../../state/contract';
import { nftContractUpdates } from '../../../../state/nftContract';
import { mockMemberNftInstance, RecoilObserver } from '../../../mocks';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: () => (mockMemberNftInstance),
  },
  utilities: { isEthereumAddress: () => (true) },
}));

const contracts = [
  {
    address: '0xselectedContract', chainId: '4', whitelisted: 2000, templateId: '1',
  },
];

const initializeState = (settings:any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(nftContractUpdates, {
    tiers: [
      {
        name: 'Test Tier', description: 'Test Description', tierId: '0', salePrice: 100, royaltyBasis: 500, isTransferable: false,
      },
    ],
  });
};

const initializeEmptyState = (settings:any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(nftContractUpdates, {
    tiers: [
      {
        name: '', description: '', tierId: 0, salePrice: 0, royaltyBasis: 0, isTransferable: false,
      },
    ],
  });
};

const initializeNoTiers = (settings:any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(nftContractUpdates, {});
};

describe('Tiers component tests', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Tiers />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('TIER ID')).toBeVisible();
      expect(screen.getByText('TIER NAME')).toBeVisible();
      expect(screen.getByText('DESCRIPTION')).toBeVisible();
      expect(screen.getByText('MINT PRICE (RIN)')).toBeVisible();
      expect(screen.getByText('ROYALTY ON SECONDARY SALES')).toBeVisible();
      expect(screen.getByText('TRANSFERABLE')).toBeVisible();
      expect(screen.getByDisplayValue('0')).toBeVisible();
      expect(screen.getByDisplayValue('Test Tier')).toBeVisible();
      expect(screen.getByDisplayValue('Test Description')).toBeVisible();
      expect(screen.getByDisplayValue('100')).toBeVisible();
      expect(screen.getByDisplayValue('5')).toBeVisible();
    });
  });

  test('It renders when no tiers exist', async () => {
    render(
      <RecoilRoot initializeState={initializeNoTiers}>
        <Tiers />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('No tiers created yet')).toBeVisible();
      expect(screen.getByText('Add a Tier')).toBeVisible();
    });
  });

  test('Setting fields correctly updates state', async () => {
    const contractUpdatesObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeEmptyState}>
        <RecoilObserver node={nftContractUpdates} onChange={contractUpdatesObserver} />
        <Tiers />
      </RecoilRoot>,
    );

    userEvent.type(screen.getByTestId('name'), 'A TIER NAME');
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        tiers: [
          {
            name: 'A TIER NAME', tierId: 0, description: '', salePrice: 0, royaltyBasis: 0, isTransferable: false,
          },
        ],
      }));
    });

    userEvent.type(screen.getByTestId('description'), 'A TIER DESCRIPTION');
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        tiers: [
          {
            name: 'A TIER NAME', tierId: 0, description: 'A TIER DESCRIPTION', salePrice: 0, royaltyBasis: 0, isTransferable: false,
          },
        ],
      }));
    });

    userEvent.type(screen.getByTestId('price'), '1.5');
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        tiers: [
          {
            name: 'A TIER NAME', tierId: 0, description: 'A TIER DESCRIPTION', salePrice: 1.5, royaltyBasis: 0, isTransferable: false,
          },
        ],
      }));
    });

    userEvent.type(screen.getByTestId('royalty'), '5.5');
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        tiers: [
          {
            name: 'A TIER NAME', tierId: 0, description: 'A TIER DESCRIPTION', salePrice: 1.5, royaltyBasis: 550, isTransferable: false,
          },
        ],
      }));
    });

    userEvent.click(screen.getByTestId('transferable'));
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        tiers: [
          {
            name: 'A TIER NAME', tierId: 0, description: 'A TIER DESCRIPTION', salePrice: 1.5, royaltyBasis: 550, isTransferable: true,
          },
        ],
      }));
    });

    userEvent.click(screen.getByTestId('addTier'));
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        tiers: [
          {
            name: 'A TIER NAME', tierId: 0, description: 'A TIER DESCRIPTION', salePrice: 1.5, royaltyBasis: 550, isTransferable: true,
          },
          {
            name: '', tierId: 1, description: '', salePrice: 0, royaltyBasis: 0, isTransferable: false,
          },
        ],
      }));
    });
  });
});
