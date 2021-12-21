import React from 'react';
import { RecoilRoot } from 'recoil';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { walletState } from '../../../state/wallet';
import { nftState } from '../../../state/nftContract';
import TokenQuery from '../../../components/nft/TokenQuery';

const mockOwnerOf = jest.fn();
const mockTokenUri = jest.fn();
const mockGetApproved = jest.fn();
const mockSafeTransferFromAndWait = jest.fn();

const initializeState = (settings:any) => {
  settings.set(walletState, { address: ['0x123456789'] });
  settings.set(nftState, {
    isSelected: true,
    address: '0x1234567890abce',
    instance: {
      name: jest.fn(() => ('ZKL-Test')),
      symbol: jest.fn(() => ('ZKLT')),
      totalSupply: jest.fn(() => (9999)),
      tokenUri: mockTokenUri,
      ownerOf: mockOwnerOf,
      getApproved: mockGetApproved,
      safeTransferFromAndWait: mockSafeTransferFromAndWait,
    },
  });
};

describe('TokenQuery component tests', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <TokenQuery />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Total Minted Supply: 9999')).toBeVisible();
      expect(screen.getByText('Get Token Data')).toBeVisible();
    });
  });

  test('Querying a token correctly calls NFT service', async () => {
    mockOwnerOf.mockResolvedValueOnce('123');
    mockTokenUri.mockResolvedValueOnce('123');
    mockGetApproved.mockResolvedValueOnce('123');

    render(
      <RecoilRoot initializeState={initializeState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <TokenQuery />
        </React.Suspense>
      </RecoilRoot>,
    );

    // Wait one second for render
    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const tokenQueryForm = await screen.getByTestId('tokenQueryForm');
    const tokenQueryButton = await screen.getByTestId('tokenQueryButton');

    await userEvent.type(tokenQueryForm, '101');
    await userEvent.click(tokenQueryButton);

    await waitFor(() => {
      expect(mockOwnerOf).toHaveBeenCalledWith(101);
      expect(mockTokenUri).toHaveBeenCalledWith(101);
      expect(mockGetApproved).toHaveBeenCalledWith(101);
    });
  });

  test('Token details are correctly displayed', async () => {
    mockOwnerOf.mockResolvedValueOnce('123');
    mockTokenUri.mockResolvedValueOnce('123');
    mockGetApproved.mockResolvedValueOnce('123');

    render(
      <RecoilRoot initializeState={initializeState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <TokenQuery />
        </React.Suspense>
      </RecoilRoot>,
    );

    // Wait one second for render
    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const tokenQueryForm = await screen.getByTestId('tokenQueryForm');
    const tokenQueryButton = await screen.getByTestId('tokenQueryButton');

    await userEvent.type(tokenQueryForm, '101');
    await userEvent.click(tokenQueryButton);

    await waitFor(() => {
      expect(screen.getByText('Token URI : 123')).toBeVisible();
      expect(screen.getByText('Owned by : 123')).toBeVisible();
      expect(screen.getByText('Approved operator : 123')).toBeVisible();
    });
  });

  test('Token detail errors are correctly displayed', async () => {
    mockOwnerOf.mockRejectedValueOnce({});

    render(
      <RecoilRoot initializeState={initializeState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <TokenQuery />
        </React.Suspense>
      </RecoilRoot>,
    );

    // Wait one second for render
    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const tokenQueryForm = await screen.getByTestId('tokenQueryForm');
    const tokenQueryButton = await screen.getByTestId('tokenQueryButton');

    await userEvent.type(tokenQueryForm, '101');
    await userEvent.click(tokenQueryButton);

    await waitFor(() => {
      expect(screen.getByText('There was an issue fetching this token data or this tokenId does not exist')).toBeVisible();
    });
  });

  test('Transfer success workflow', async () => {
    mockOwnerOf.mockResolvedValueOnce('0x123456789');
    mockTokenUri.mockResolvedValueOnce('https://token101.com');
    mockGetApproved.mockResolvedValueOnce('0x000000');

    render(
      <RecoilRoot initializeState={initializeState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <TokenQuery />
        </React.Suspense>
      </RecoilRoot>,
    );

    // Wait one second for render
    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const tokenQueryForm = await screen.getByTestId('tokenQueryForm');
    const tokenQueryButton = await screen.getByTestId('tokenQueryButton');

    await userEvent.type(tokenQueryForm, '101');
    await userEvent.click(tokenQueryButton);

    await waitFor(() => {
      expect(screen.getByText('Token URI : https://token101.com')).toBeVisible();
      expect(screen.getByText('Owned by : 0x123456789')).toBeVisible();
      expect(screen.getByText('Approved operator : 0x000000')).toBeVisible();
    });

    const transferForm = await screen.getByTestId('transferForm');
    const transferButton = await screen.getByTestId('transferButton');

    await userEvent.type(transferForm, '0x987654321');
    await userEvent.click(transferButton);

    await waitFor(() => {
      expect(mockSafeTransferFromAndWait).toHaveBeenCalledWith('0x123456789', '0x987654321', 101);
      expect(screen.getByText('Token URI : https://token101.com')).toBeVisible();
      expect(screen.getByText('Owned by : 0x987654321')).toBeVisible();
      expect(screen.getByText('Approved operator : 0x000000')).toBeVisible();
    });
  });

  test('Transfer error workflow', async () => {
    mockOwnerOf.mockResolvedValueOnce('0x123456789');
    mockTokenUri.mockResolvedValueOnce('https://token101.com');
    mockGetApproved.mockResolvedValueOnce('0x000000');
    mockSafeTransferFromAndWait.mockRejectedValue({ message: 'Error with transfer' });

    render(
      <RecoilRoot initializeState={initializeState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <TokenQuery />
        </React.Suspense>
      </RecoilRoot>,
    );

    // Wait one second for render
    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const tokenQueryForm = await screen.getByTestId('tokenQueryForm');
    const tokenQueryButton = await screen.getByTestId('tokenQueryButton');

    await userEvent.type(tokenQueryForm, '101');
    await userEvent.click(tokenQueryButton);

    await waitFor(() => {
      expect(screen.getByText('Token URI : https://token101.com')).toBeVisible();
      expect(screen.getByText('Owned by : 0x123456789')).toBeVisible();
      expect(screen.getByText('Approved operator : 0x000000')).toBeVisible();
    });

    const transferForm = await screen.getByTestId('transferForm');
    const transferButton = await screen.getByTestId('transferButton');

    await userEvent.type(transferForm, '0x987654321');
    await userEvent.click(transferButton);

    await waitFor(() => {
      expect(mockSafeTransferFromAndWait).toHaveBeenCalledWith('0x123456789', '0x987654321', 101);
      expect(screen.getByText('Token URI : https://token101.com')).toBeVisible();
      expect(screen.queryByText('Owned by : 0x987654321')).not.toBeInTheDocument();
      expect(screen.getByText('Owned by : 0x123456789')).toBeVisible();
      expect(screen.getByText('Approved operator : 0x000000')).toBeVisible();
      expect(screen.getByText('Error with transfer')).toBeVisible();
    });
  });
});
