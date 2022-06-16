import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Admins from '../../../components/manageProjects/Admins';
import { contractsState, selectedContractState } from '../../../state/contract';
import { mockMemberNftInstance } from '../../mocks';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: () => (mockMemberNftInstance),
  },
}));

jest.mock('../../../components/manageProjects/AdminsModal', () => ({
  __esModule: true,
  default: ({ open }:{open: string}) => <p>{`MODAL OPEN FOR ${open}`}</p>,
}));

const contracts = [
  { address: '0xcontract10000000000000000000000000000000', chainId: '1' },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, '0xcontract10000000000000000000000000000000');
  settings.set(contractsState, contracts);
};

describe('Admin component tests', () => {
  test('It renders', async () => {
    mockMemberNftInstance.getRoleMembers.mockResolvedValueOnce(
      ['0xadmin'],
    ).mockResolvedValueOnce([
      ['0xminter'],
    ]);

    render(
      <RecoilRoot initializeState={initializeState}>
        <Admins />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('SET UP OTHER ACCOUNTS AS CONTRACT MANAGERS')).toBeVisible();
      expect(screen.getByText('ADMINISTRATOR ACCOUNTS')).toBeVisible();
      expect(screen.getByText('0xadmin')).toBeVisible();
      expect(screen.getByText('MINTER ACCOUNTS')).toBeVisible();
      expect(screen.getByText('0xminter')).toBeVisible();
    });
  });

  test('Clicking new record opens the modal for admin', async () => {
    mockMemberNftInstance.getRoleMembers.mockResolvedValueOnce(
      ['0xadmin'],
    ).mockResolvedValueOnce([
      ['0xminter'],
    ]);

    render(
      <RecoilRoot initializeState={initializeState}>
        <Admins />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('newAdmin'));

    await waitFor(() => {
      expect(screen.getByText('MODAL OPEN FOR admin')).toBeVisible();
    });
  });

  test('Clicking new record opens the modal for minter', async () => {
    mockMemberNftInstance.getRoleMembers.mockResolvedValueOnce(
      ['0xadmin'],
    ).mockResolvedValueOnce([
      ['0xminter'],
    ]);

    render(
      <RecoilRoot initializeState={initializeState}>
        <Admins />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('newMinter'));

    await waitFor(() => {
      expect(screen.getByText('MODAL OPEN FOR minter')).toBeVisible();
    });
  });
});
