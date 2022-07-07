import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Admins from '../../../components/manageProjects/Admins';
import { contractsState, selectedContractState } from '../../../state/contract';
import { mockMemberNftInstance } from '../../mocks';
import { updateContract } from '../../../utils/api';
import { walletState } from '../../../state/wallet';

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

jest.mock('../../../utils/api', () => ({
  updateContract: jest.fn(),
}));

const mockUpdateContract = updateContract as jest.Mocked<any>;

const contracts = [
  { address: '0xcontract10000000000000000000000000000000', chainId: '1' },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, '0xcontract10000000000000000000000000000000');
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
};

describe('Admin component tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    mockMemberNftInstance.getRoleMembers.mockResolvedValueOnce(
      ['0xadmin'],
    ).mockResolvedValueOnce(
      ['0xminter'],
    );

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
      expect(screen.getByTestId('removeAdmin-0xadmin')).toBeVisible();
      expect(screen.getByTestId('removeMinter-0xminter')).toBeVisible();
    });
  });

  test('Clicking new record opens the modal for admin', async () => {
    mockMemberNftInstance.getRoleMembers.mockResolvedValueOnce(
      ['0xadmin'],
    ).mockResolvedValueOnce(
      ['0xminter'],
    );

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
    ).mockResolvedValueOnce(
      ['0xminter'],
    );

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

  test('Remove admin workflow', async () => {
    mockMemberNftInstance.getRoleMembers.mockResolvedValueOnce(
      ['0xadmin'],
    ).mockResolvedValueOnce(
      ['0xminter'],
    );

    const wait = jest.fn();
    mockMemberNftInstance.revokeRole.mockResolvedValueOnce({ wait });

    render(
      <RecoilRoot initializeState={initializeState}>
        <Admins />
      </RecoilRoot>,
    );

    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await userEvent.click(screen.getByTestId('removeAdmin-0xadmin'));

    await waitFor(() => {
      expect(mockMemberNftInstance.revokeRole).toHaveBeenCalledWith('DEFAULT_ADMIN_ROLE', '0xadmin');
      expect(wait).toHaveBeenCalledTimes(1);
      expect(mockUpdateContract).toHaveBeenCalledWith({
        address: '0xcontract10000000000000000000000000000000',
        admins: [],
      });
    });
  });

  test('Remove minter workflow', async () => {
    mockMemberNftInstance.getRoleMembers.mockResolvedValueOnce(
      ['0xadmin'],
    ).mockResolvedValueOnce(
      ['0xminter'],
    );

    const wait = jest.fn();
    mockMemberNftInstance.revokeRole.mockResolvedValueOnce({ wait });

    render(
      <RecoilRoot initializeState={initializeState}>
        <Admins />
      </RecoilRoot>,
    );

    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await userEvent.click(screen.getByTestId('removeMinter-0xminter'));

    await waitFor(() => {
      expect(mockMemberNftInstance.revokeRole).toHaveBeenCalledWith('MINTER_ROLE', '0xminter');
      expect(wait).toHaveBeenCalledTimes(1);
    });
  });
});
