import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Whitelist from '../../../components/manageProjects/Whitelist';
import { contractsState, selectedContractState } from '../../../state/contract';
import { mockMemberNftInstance } from '../../mocks';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: () => (mockMemberNftInstance),
  },
  utilities: { isEthereumAddress: () => (true) },
}));

jest.mock('../../../utils/blockchainData', () => ({
  getOwnerBalances: () => ({ one: 1, two: 2, three: 3 }),
  nftContractRevenueAndTransfers: () => ({ contractRevenue: 123, transfers: 15 }),
}));

jest.mock('../../../components/manageProjects/WhitelistModal', () => ({
  __esModule: true,
  default: () => <p>MODAL OPEN</p>,
}));

jest.mock('../../../utils/api', () => ({
  getAllVouchers: () => ([{
    createdAt: '2022-03-13 20:17:45.942 -0400',
    userAddress: 'one',
    balance: 1,
    roleId: 'venture',
  },
  {
    createdAt: '2022-03-13 20:17:45.942 -0400',
    userAddress: 'two',
    balance: 1,
    roleId: 'creator',
  },
  {
    createdAt: '2022-03-13 20:17:45.942 -0400',
    userAddress: 'three',
    balance: 1,
    roleId: 'member',
  },
  ]),
}));

const contracts = [
  {
    address: '0xselectedContract', chainId: '1', whitelisted: 2000, templateId: '1',
  },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
};

describe('Whitelist component tests', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Whitelist />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('CREATED')).toBeVisible();
      expect(screen.getByText('REDEEMED')).toBeVisible();
      expect(screen.getByText('USER ADDRESS')).toBeVisible();
      expect(screen.getByText('# WHITELISTED')).toBeVisible();
      expect(screen.getByText('TIER ACCESS')).toBeVisible();
      expect(screen.getByText('NOTE')).toBeVisible();
      expect(screen.getByText('one')).toBeVisible();
      expect(screen.getByText('venture')).toBeVisible();
      expect(screen.getByText('two')).toBeVisible();
      expect(screen.getByText('creator')).toBeVisible();
      expect(screen.getByText('three')).toBeVisible();
      expect(screen.getByText('member')).toBeVisible();
    });
  });

  test('Clicking new record opens the modal', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Whitelist />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('CREATED')).toBeVisible();
      expect(screen.getByText('REDEEMED')).toBeVisible();
      expect(screen.getByText('USER ADDRESS')).toBeVisible();
      expect(screen.getByText('# WHITELISTED')).toBeVisible();
      expect(screen.getByText('TIER ACCESS')).toBeVisible();
      expect(screen.getByText('NOTE')).toBeVisible();
      expect(screen.getByText('one')).toBeVisible();
      expect(screen.getByText('venture')).toBeVisible();
      expect(screen.getByText('two')).toBeVisible();
      expect(screen.getByText('creator')).toBeVisible();
      expect(screen.getByText('three')).toBeVisible();
      expect(screen.getByText('member')).toBeVisible();
    });

    await userEvent.click(screen.getByText('ADD NEW RECORD'));

    await waitFor(() => {
      expect(screen.getByText('MODAL OPEN')).toBeVisible();
    });
  });
});
