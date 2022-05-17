import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import NftBox from '../../../components/manageProjects/NftBox';
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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ address: '0xselectedContract' }),
}));

jest.mock('axios', () => jest.fn());

const contracts = [
  { address: '0xselectedContract', chainId: '1' },
];

// renders when state is loaded
// makes an api request when it is not
// returns null when search differs
// click sets selected index

const initializeState = (settings: any) => {
  settings.set(selectedContractState, '0xselectedContract');
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(nftTokenState('0xselectedContract:1'), {
    image: 'ipfs CID',
    tokenUri: 'tokenURI',
    owner: '0xOwnerAddress',
    tokenId: '1',
    attributes: [
      { trait_type: 'Role', value: 'Member' },
    ],
  });
};

const initializeNoNftState = (settings: any) => {
  settings.set(selectedContractState, '0xselectedContract');
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
};

const initializeSearchState = (settings: any) => {
  settings.set(selectedContractState, '0xselectedContract');
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(nftSearchText, 'no match');
};

const mockIpfs = Ipfs as jest.Mocked<any>;
const mockAxios = axios as jest.Mocked<any>;

describe('NftBox component tests', () => {
  test('It renders', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <NftBox index={1} />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('image')).toHaveAttribute('src', 'https://mockCID');
      expect(screen.getByText('0xOwne...ress')).toBeVisible();
      expect(screen.getByText('1')).toBeVisible();
    });
  });

  test('Correctly calls API when NFT data is not in memory', async () => {
    const mockGetGatewayUrl = jest.fn();
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: mockGetGatewayUrl }));
    mockMemberNftInstance.getToken.mockResolvedValue({
      tokenUri: 'tokenURI',
    });

    mockGetGatewayUrl.mockReturnValueOnce('https://tokenURI');

    render(
      <RecoilRoot initializeState={initializeNoNftState}>
        <MemoryRouter>
          <NftBox index={0} />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(mockMemberNftInstance.getToken).toHaveBeenCalledWith(0);
      expect(mockGetGatewayUrl).toHaveBeenCalledWith('tokenURI');
      expect(mockAxios).toHaveBeenCalledWith('https://tokenURI');
    });
  });

  test('Returns null when search text does not match', async () => {
    render(
      <RecoilRoot initializeState={initializeSearchState}>
        <MemoryRouter>
          <NftBox index={0} />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  test('Clicking sets the selectedNft state', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));
    const selectedNftObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={selectedNftState} onChange={selectedNftObserver} />
        <MemoryRouter>
          <NftBox index={1} />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('image'));

    await waitFor(() => {
      expect(selectedNftObserver).toHaveBeenCalledWith(1);
    });
  });
});
