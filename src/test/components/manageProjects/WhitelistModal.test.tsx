import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { storeVoucher } from '../../../utils/api';
import WhitelistModal from '../../../components/manageProjects/WhitelistModal';
import { contractsState, selectedContractState } from '../../../state/contract';
import { mockMemberNftInstance } from '../../mocks';
import { walletState } from '../../../state/wallet';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: () => (mockMemberNftInstance),
  },
  utilities: { isEthereumAddress: () => (true) },
}));

jest.mock('../../../utils/api', () => ({
  storeVoucher: jest.fn(),
}));

const contracts = [
  {
    address: '0xselectedContract', chainId: '1', whitelisted: 2000, templateId: '1',
  },
];

const initializeState = (settings: any) => {
  settings.set(walletState, { chainId: '1', provider: jest.fn() });
  settings.set(contractsState, contracts);
  settings.set(selectedContractState, { address: '0xselectedContract' });
};

const mockStoreVoucher = storeVoucher as jest.Mocked<any>;

describe('WhitelistModal component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <WhitelistModal open closeModal={jest.fn()} />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('ADD ACCOUNT TO WHITELIST')).toBeVisible();
      expect(screen.getByText('USER ADDRESS')).toBeVisible();
      expect(screen.getByText('WHITELISTED ROLE')).toBeVisible();
      expect(screen.getByText('QUANTITY')).toBeVisible();
      expect(screen.getByText('NOTE (OPTIONAL)')).toBeVisible();
    });
  });

  test('Create voucher workflow', async () => {
    mockMemberNftInstance.signMintVoucher.mockResolvedValue({
      mock: 'voucher',
      balance: '10',
    });

    render(
      <RecoilRoot initializeState={initializeState}>
        <WhitelistModal open closeModal={jest.fn()} />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('ADD ACCOUNT TO WHITELIST')).toBeVisible();
      expect(screen.getByText('USER ADDRESS')).toBeVisible();
      expect(screen.getByText('WHITELISTED ROLE')).toBeVisible();
      expect(screen.getByText('QUANTITY')).toBeVisible();
      expect(screen.getByText('NOTE (OPTIONAL)')).toBeVisible();
    });

    await userEvent.type(screen.getByTestId('userAddress'), '0xmockuser');
    await userEvent.type(screen.getByTestId('quantity'), '0');
    await userEvent.click(screen.getByText('SAVE VOUCHER'));

    await waitFor(() => {
      expect(mockMemberNftInstance.signMintVoucher).toHaveBeenCalledWith(
        '0xmockuser',
        10,
        undefined,
      );
      expect(mockStoreVoucher).toHaveBeenCalledWith(
        {
          contractAddress: '0xselectedContract',
          userAddress: '0xmockuser',
          balance: '10',
          chainId: '1',
          roleId: undefined,
          signedVoucher: { mock: 'voucher', balance: '10' },
        },
      );
    });
  });
});
