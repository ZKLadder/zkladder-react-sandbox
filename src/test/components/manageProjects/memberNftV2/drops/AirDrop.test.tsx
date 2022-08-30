import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AirDrop from '../../../../../components/manageProjects/memberNftV2/drops/AirDrop';
import { manageProjectsPageState } from '../../../../../state/page';
import { selectedContractState, contractsState } from '../../../../../state/contract';
import { walletState } from '../../../../../state/wallet';
import { RecoilObserver, mockMemberNftInstance } from '../../../../mocks';

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

const initializeState = (settings:any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
};

describe('DropTable component tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValue([
      {
        name: 'Test Tier', description: 'test', image: 'ipfs://123456789', isTransferable: false, salePrice: 1.5, royaltyBasis: 150,
      },
    ]);

    render(
      <RecoilRoot initializeState={initializeState}>
        <AirDrop />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Airdrop an NFT to one of your end users - covering the gast cost yourself.')).toBeVisible();
      expect(screen.getByText('MEMBERSHIP TIER')).toBeVisible();
      expect(screen.getByText('Test Tier')).toBeVisible();
      expect(screen.getByText('ROYALTIES')).toBeVisible();
      expect(screen.getByDisplayValue('1.5')).toBeVisible();
      expect(screen.getByText('TRANSFERABILITY')).toBeVisible();
      expect(screen.getByDisplayValue('Non-Transferable')).toBeVisible();
      expect(screen.getByText('HOLDER ADDRESS (Required)')).toBeVisible();
      expect(screen.getByText('NFT NAME')).toBeVisible();
      expect(screen.getByText('NFT DESCRIPTION')).toBeVisible();
      expect(screen.getByText('NFT IMAGE')).toBeVisible();
      expect(screen.getByText('MINT THIS NFT')).toBeVisible();
      expect(screen.getByText('HOLDER ADDRESS (Required)')).toBeVisible();
    });
  });

  test('It correctly calls the SDK service', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValue([
      {
        name: 'Test Tier', description: 'test', image: 'ipfs://123456789', isTransferable: false, salePrice: 1.5, royaltyBasis: 150,
      },
    ]);

    mockMemberNftInstance.mintTo.mockResolvedValue({
      wait: jest.fn(),
    });

    const pageStateObserver = jest.fn();

    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={manageProjectsPageState} onChange={pageStateObserver} />
        <AirDrop />
      </RecoilRoot>,
    );

    await userEvent.type(screen.getByTestId('userAddress'), '0xmockuser');
    await userEvent.type(screen.getByTestId('nftName'), 'Mock Name');
    await userEvent.type(screen.getByTestId('nftDescription'), 'Mock Description');
    await userEvent.click(screen.getByTestId('mintButton'));

    await waitFor(() => {
      expect(mockMemberNftInstance.mintTo).toHaveBeenCalledWith(
        '0xmockuser',
        { description: 'Mock Description', name: 'Mock Name', tierId: 0 },
      );
      expect(pageStateObserver).toHaveBeenCalledWith('collection');
    });
  });
});
