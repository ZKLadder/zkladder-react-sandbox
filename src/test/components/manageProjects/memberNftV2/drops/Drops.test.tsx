import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import Drops from '../../../../../components/manageProjects/memberNftV2/drops/Drops';
import { dropSectionState } from '../../../../../state/page';
import { mockMemberNftInstance } from '../../../../mocks';
import { contractsState, selectedContractState } from '../../../../../state/contract';
import { walletState } from '../../../../../state/wallet';

jest.mock('../../../../../components/manageProjects/memberNftV2/drops/AirDrop', () => ({
  __esModule: true,
  default: () => <p>AIRDROP COMPONENT</p>,
}));

jest.mock('../../../../../components/manageProjects/memberNftV2/drops/DropTable', () => ({
  __esModule: true,
  default: () => <p>DROP TABLE COMPONENT</p>,
}));

jest.mock('../../../../../components/manageProjects/memberNftV2/drops/ManageDrop', () => ({
  __esModule: true,
  default: () => <p>MANAGE DROP COMPONENT</p>,
}));

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNftV2: {
    setup: () => (mockMemberNftInstance),
  },
  utilities: { isEthereumAddress: () => (true) },
}));

const contracts = [
  { address: '0xselectedContract', chainId: '1', templateId: '3' },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
};

const initializeAirdropState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(dropSectionState, 'airDrop');
};

const initializeManageState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(dropSectionState, 'manageDrop');
};

describe('Drops component tests', () => {
  test('It renders', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValue([
      {
        name: 'Test Tier', description: 'test', image: 'ipfs://123456789', isTransferable: false, salePrice: 1.5, royaltyBasis: 150,
      },
    ]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <Drops />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('DROP TABLE COMPONENT')).toBeVisible();
    });
  });

  test('It renders when tiers DO NOT exist', async () => {
    render(
      <RecoilRoot>
        <Drops />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('You must create at least one tier for this community before you can mint any NFT\'s')).toBeVisible();
    });
  });

  test('It renders when airdrop is the selected section', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValue([
      {
        name: 'Test Tier', description: 'test', image: 'ipfs://123456789', isTransferable: false, salePrice: 1.5, royaltyBasis: 150,
      },
    ]);
    render(
      <RecoilRoot initializeState={initializeAirdropState}>
        <Drops />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('AIRDROP COMPONENT')).toBeVisible();
    });
  });

  test('It renders when manage drop is the selected section', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValue([
      {
        name: 'Test Tier', description: 'test', image: 'ipfs://123456789', isTransferable: false, salePrice: 1.5, royaltyBasis: 150,
      },
    ]);
    render(
      <RecoilRoot initializeState={initializeManageState}>
        <Drops />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MANAGE DROP COMPONENT')).toBeVisible();
    });
  });
});
