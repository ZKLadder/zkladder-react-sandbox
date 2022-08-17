import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import userEvent from '@testing-library/user-event';
import Collection from '../../../components/manageProjects/Collection';
import { contractsState, selectedContractState } from '../../../state/contract';
import { mockMemberNftInstance, RecoilObserver } from '../../mocks';
import { walletState } from '../../../state/wallet';
import { selectedNftState, nftTokenState, nftSearchText } from '../../../state/nftContract';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: () => (mockMemberNftInstance),
  },
  utilities: { isEthereumAddress: () => (true) },
}));

jest.mock('react-responsive-virtual-grid', () => ({
  __esModule: true,
  default: () => <p>VIRTUAL GRID</p>,
}));

const contracts = [
  { address: '0xselectedContract', chainId: '1', templateId: '1' },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(selectedNftState, 0);
  settings.set(nftTokenState('0xselectedContract:0'), {
    image: 'ipfs CID',
    name: 'mock nft',
    tokenUri: 'tokenURI',
    owner: '0xOwnerAddress',
    tokenId: '0',
    attributes: [
      { trait_type: 'Role', value: 'Member' },
    ],
  });
};
const mockIpfs = Ipfs as jest.Mocked<any>;

describe('Collection component tests', () => {
  test('It renders', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));
    mockMemberNftInstance.totalSupply.mockResolvedValue(1);

    render(
      <RecoilRoot initializeState={initializeState}>
        <Collection />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('image')).toHaveAttribute('src', 'https://mockCID');
      expect(screen.getByText('0xOwne...ress')).toBeVisible();
      expect(screen.getByText('0')).toBeVisible();
      expect(screen.getByText('Role')).toBeVisible();
      expect(screen.getByText('Member')).toBeVisible();
    });
  });

  test('TokenId search bar correctly updates state', async () => {
    const searchStateObserver = jest.fn();
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));
    mockMemberNftInstance.totalSupply.mockResolvedValue(1);

    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={nftSearchText} onChange={searchStateObserver} />
        <Collection />
      </RecoilRoot>,
    );

    const searchBar = screen.getByTestId('addressSearch');
    await userEvent.type(searchBar, 'mock token id');

    await waitFor(() => {
      expect(searchStateObserver).toHaveBeenCalledWith('mock token id');
    });
  });
});
