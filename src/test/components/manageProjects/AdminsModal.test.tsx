import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminsModal from '../../../components/manageProjects/AdminsModal';
import { contractsState, selectedContractState } from '../../../state/contract';
import { mockMemberNftInstance } from '../../mocks';
import { walletState } from '../../../state/wallet';
import { updateContract } from '../../../utils/api';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: () => (mockMemberNftInstance),
  },
  utilities: { isEthereumAddress: () => (true) },
}));

jest.mock('../../../utils/api', () => ({
  updateContract: jest.fn(),
}));

const mockUpdateContract = updateContract as jest.Mocked<any>;

const contracts = [
  { address: '0xcontract10000000000000000000000000000000', chainId: '1', templateId: '1' },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xcontract10000000000000000000000000000000' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
};

describe('Admins modal tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders an admin modal', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <AdminsModal open="admin" closeModal={jest.fn()} />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('REGISTER NEW ADMINISTRATOR')).toBeVisible();
      expect(screen.getByText('This account will be able to configure contract settings like roles, royalties and transferability, as well as create new admins and minters'))
        .toBeVisible();
    });
  });

  test('It renders a minter modal', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <AdminsModal open="minter" closeModal={jest.fn()} />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('REGISTER NEW MINTER')).toBeVisible();
      expect(screen.getByText('This account will be approved to sign mint vouchers and mint new tokens'))
        .toBeVisible();
    });
  });

  test('It makes the correct SDK call when registering an admin', async () => {
    const wait = jest.fn();
    mockMemberNftInstance.grantRole.mockResolvedValueOnce({ wait });
    render(
      <RecoilRoot initializeState={initializeState}>
        <AdminsModal open="admin" closeModal={jest.fn()} />
      </RecoilRoot>,
    );

    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const input = screen.getByTestId('addressInput');

    await userEvent.type(input, '0xMockUserAddress');
    await userEvent.click(screen.getByText('ADD RECORD'));

    await waitFor(() => {
      expect(mockMemberNftInstance.grantRole).toHaveBeenCalledWith('DEFAULT_ADMIN_ROLE', '0xMockUserAddress');
      expect(wait).toHaveBeenCalledTimes(1);
      expect(mockUpdateContract).toHaveBeenCalledWith({
        address: '0xmockNFTaddress',
        admins: ['0xmockuseraddress'],
      });
    });
  });

  test('It makes the correct SDK call when registering a minter', async () => {
    const wait = jest.fn();
    mockMemberNftInstance.grantRole.mockResolvedValueOnce({ wait });
    render(
      <RecoilRoot initializeState={initializeState}>
        <AdminsModal open="minter" closeModal={jest.fn()} />
      </RecoilRoot>,
    );

    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const input = screen.getByTestId('addressInput');

    await userEvent.type(input, '0xMockUserAddress');
    await userEvent.click(screen.getByText('ADD RECORD'));

    await waitFor(() => {
      expect(mockMemberNftInstance.grantRole).toHaveBeenCalledWith('MINTER_ROLE', '0xMockUserAddress');
      expect(wait).toHaveBeenCalledTimes(1);
    });
  });

  test('Hitting cancel closes the modal', async () => {
    const closeModal = jest.fn();
    render(
      <RecoilRoot initializeState={initializeState}>
        <AdminsModal open="minter" closeModal={closeModal} />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByText('CANCEL'));

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalledTimes(1);
    });
  });
});
