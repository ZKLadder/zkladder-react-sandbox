import React from 'react';
import { RecoilRoot } from 'recoil';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import userEvent from '@testing-library/user-event';
import ProjectSidebar from '../../../components/manageProjects/ProjectSidebar';
import { contractsState, selectedContractState } from '../../../state/contract';
import { mockMemberNftInstance, RecoilObserver } from '../../mocks';
import { nftContractUpdates } from '../../../state/nftContract';

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

const contracts = [
  {
    address: '0xselectedContract', chainId: '1', whitelisted: 2000, templateId: '1',
  },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
};

global.URL.createObjectURL = jest.fn(() => ('mockData.png'));

const mockIpfs = Ipfs as jest.Mocked<any>;

describe('ProjectSidebar component tests', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('It renders', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));
    mockMemberNftInstance.totalSupply.mockResolvedValue(712);
    mockMemberNftInstance.getCollectionMetadata.mockResolvedValueOnce({
      image: 'ipfs://mockCID',
      name: 'MOCK ZKL CONTRACT',
    });

    render(
      <RecoilRoot initializeState={initializeState}>
        <ProjectSidebar />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('image')).toHaveAttribute('src', 'https://mockCID');
      expect(screen.getByText('VOUCHERS REDEEMED:')).toBeVisible();
      expect(screen.getByText('712/2000')).toBeVisible();
      expect(screen.getByText('MINTED')).toBeVisible();
      expect(screen.getByText('HOLDERS')).toBeVisible();
      expect(screen.getByText('MINT INCOME')).toBeVisible();
      expect(screen.getByText('$123')).toBeVisible();
      expect(screen.getByText('TRANSFERS')).toBeVisible();
    });
  });

  test('Update contract image workflow', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));
    mockMemberNftInstance.totalSupply.mockResolvedValue(712);
    mockMemberNftInstance.getCollectionMetadata.mockResolvedValueOnce({
      image: 'ipfs://mockCID',
      name: 'MOCK ZKL CONTRACT',
    });

    const contractUpdatesObserver = jest.fn();

    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={nftContractUpdates} onChange={contractUpdatesObserver} />
        <ProjectSidebar />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('updateImage'));

    await waitFor(() => {
      expect(screen.getByTestId('dropzone')).toBeVisible();
    });

    const mockImage = new File(['image'], 'mockData.png', {
      type: 'image/png',
    });

    Object.defineProperty(screen.getByTestId('dropzone'), 'files', {
      value: [mockImage],
    });

    await fireEvent.drop(screen.getByTestId('dropzone'));

    await waitFor(() => {
      expect(contractUpdatesObserver).toHaveBeenCalledWith(expect.objectContaining({
        image: mockImage,
      }));
    });
  });
});
