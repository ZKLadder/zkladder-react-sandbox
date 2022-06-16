import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';
import Roles from '../../../components/manageProjects/Roles';
import { selectedContractState, contractsState } from '../../../state/contract';
import { nftContractUpdates } from '../../../state/nftContract';
import { mockMemberNftInstance, RecoilObserver } from '../../mocks';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: () => (mockMemberNftInstance),
  },
  utilities: { isEthereumAddress: () => (true) },
}));

const contracts = [
  { address: '0xselectedContract', chainId: '4', whitelisted: 2000 },
];

const initializeState = (settings:any) => {
  settings.set(selectedContractState, '0xselectedContract');
  settings.set(contractsState, contracts);
  settings.set(nftContractUpdates, {
    roles: [
      {
        name: 'Test Role', description: 'Test Description', id: 'Test Id', price: 100,
      },
    ],
  });
};

const initializeEmptyState = (settings:any) => {
  settings.set(selectedContractState, '0xselectedContract');
  settings.set(contractsState, contracts);
  settings.set(nftContractUpdates, {
    roles: [
      {
        name: '', description: '', id: '', price: 0,
      },
    ],
  });
};

describe('Roles component tests', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Roles />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('ROLE NAME')).toBeVisible();
      expect(screen.getByDisplayValue('Test Role')).toBeVisible();
      expect(screen.getByText('ROLE ID')).toBeVisible();
      expect(screen.getByDisplayValue('Test Id')).toBeVisible();
      expect(screen.getByText('DESCRIPTION')).toBeVisible();
      expect(screen.getByDisplayValue('Test Description')).toBeVisible();
      expect(screen.getByText('MINT PRICE (RIN)')).toBeVisible();
      expect(screen.getByDisplayValue('100')).toBeVisible();
    });
  });

  test('Setting fields correctly updates state', async () => {
    const contractUpdatesObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeEmptyState}>
        <RecoilObserver node={nftContractUpdates} onChange={contractUpdatesObserver} />
        <Roles />
      </RecoilRoot>,
    );

    userEvent.type(screen.getByTestId('id'), 'A ROLE ID');
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        roles: [
          {
            name: '', id: 'A ROLE ID', description: '', price: 0,
          },
        ],
      }));
    });

    userEvent.type(screen.getByTestId('name'), 'A ROLE NAME');
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        roles: [
          {
            name: 'A ROLE NAME', id: 'A ROLE ID', description: '', price: 0,
          },
        ],
      }));
    });

    userEvent.type(screen.getByTestId('description'), 'A ROLE DESCRIPTION');
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        roles: [
          {
            name: 'A ROLE NAME', id: 'A ROLE ID', description: 'A ROLE DESCRIPTION', price: 0,
          },
        ],
      }));
    });

    userEvent.type(screen.getByTestId('price'), '1.5');
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        roles: [
          {
            name: 'A ROLE NAME', id: 'A ROLE ID', description: 'A ROLE DESCRIPTION', price: 1.5,
          },
        ],
      }));
    });

    userEvent.click(screen.getByTestId('addRole'));
    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        roles: [
          {
            name: 'A ROLE NAME', id: 'A ROLE ID', description: 'A ROLE DESCRIPTION', price: 1.5,
          },
          {
            name: '', id: '', description: '', price: 0,
          },
        ],
      }));
    });
  });
});
