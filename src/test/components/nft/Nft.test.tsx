import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { nftState, viewState } from '../../../state/nftContract';
import Nft from '../../../components/nft/Nft';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({}));

const initializeNotSelectedState = (settings:any) => {
  settings.set(nftState, {
    isSelected: false,
  });
};

const initializeQueryState = (settings:any) => {
  settings.set(nftState, {
    isSelected: true,
    address: '0x1234567890abce',
    instance: {
      name: jest.fn(() => ('ZKL-Test')),
      symbol: jest.fn(() => ('ZKLT')),
      totalSupply: jest.fn(() => (7)),
      contractUri: jest.fn(),
      getCollectionMetadata: jest.fn(() => ([])),
      address: '0x1234567890abce',
    },
  });
};

const initializeAllTokensState = (settings:any) => {
  settings.set(viewState, 'allTokens');
  settings.set(nftState, {
    isSelected: true,
    address: '0x1234567890abce',
    instance: {
      name: jest.fn(() => ('ZKL-Test')),
      symbol: jest.fn(() => ('ZKLT')),
      totalSupply: jest.fn(),
      contractUri: jest.fn(),
      getCollectionMetadata: jest.fn(() => ([])),
      getAllTokens: jest.fn(() => []),
      getAllTokensOwnedBy: jest.fn(() => []),
      address: '0x1234567890abce',
    },
  });
};

jest.mock('@zkladder/zkladder-sdk-ts', () => ({}));

describe.skip('Nft parent component', () => {
  test('Contract not selected', async () => {
    render(
      <RecoilRoot initializeState={initializeNotSelectedState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Nft />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Enter an NFT contract address to get started')).toBeVisible();
    });
  });

  test('Token query', async () => {
    render(
      <RecoilRoot initializeState={initializeQueryState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Nft />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Total Minted Supply: 7')).toBeVisible();
    });
  });

  test('All tokens', async () => {
    render(
      <RecoilRoot initializeState={initializeAllTokensState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Nft />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Go Back')).toBeVisible();
    });
  });
});
