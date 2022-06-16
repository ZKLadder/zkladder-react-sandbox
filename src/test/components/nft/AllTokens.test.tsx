import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { walletState } from '../../../state/wallet';
import { nftState, viewState } from '../../../state/nftContract';
import AllTokens from '../../../components/nft/AllTokens';

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

const mockGetAllTokens = jest.fn();
const mockGetAllTokensOwnedBy = jest.fn();

const mockNftState = {
  isSelected: true,
  address: '0x1234567890abce',
  instance: {
    getAllTokens: mockGetAllTokens,
    getAllTokensOwnedBy: mockGetAllTokensOwnedBy,
  },
};

const mockWalletState = {
  address: ['0x1234567890abce'],
};

const initializeAllTokensState = (settings:any) => {
  settings.set(nftState, mockNftState);
  settings.set(viewState, 'allTokens');
  settings.set(walletState, mockWalletState);
};

const initializeMyTokensState = (settings:any) => {
  settings.set(nftState, mockNftState);
  settings.set(viewState, 'allMyTokens');
  settings.set(walletState, mockWalletState);
};

jest.mock('@zkladder/zkladder-sdk-ts', () => ({}));

describe.skip('AllTokens component tests', () => {
  beforeEach(() => {
    // Silence react unique key errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('All tokens renders correctly', async () => {
    mockGetAllTokens.mockResolvedValueOnce([
      { tokenId: 'Token One' },
      { tokenId: 'Token Two' },
      { tokenId: 'Token Three' },
      { tokenId: 'Token Four' },
    ]);

    render(
      <RecoilRoot initializeState={initializeAllTokensState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <AllTokens />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(mockGetAllTokens).toHaveBeenCalledTimes(1);
      expect(screen.getByText('TokenID: Token One')).toBeVisible();
      expect(screen.getByText('TokenID: Token Two')).toBeVisible();
      expect(screen.getByText('TokenID: Token Three')).toBeVisible();
      expect(screen.getByText('TokenID: Token Four')).toBeVisible();
    });
  });

  test('All my tokens renders correctly', async () => {
    mockGetAllTokensOwnedBy.mockResolvedValueOnce([
      { tokenId: 'Token Five' },
      { tokenId: 'Token Six' },
      { tokenId: 'Token Seven' },
      { tokenId: 'Token Eight' },
    ]);

    render(
      <RecoilRoot initializeState={initializeMyTokensState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <AllTokens />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(mockGetAllTokensOwnedBy).toHaveBeenCalledTimes(1);
      expect(screen.getByText('TokenID: Token Five')).toBeVisible();
      expect(screen.getByText('TokenID: Token Six')).toBeVisible();
      expect(screen.getByText('TokenID: Token Seven')).toBeVisible();
      expect(screen.getByText('TokenID: Token Eight')).toBeVisible();
    });
  });

  test('All tokens errors are displayed correctly', async () => {
    mockGetAllTokens.mockRejectedValue({ message: 'All tokens error' });

    render(
      <RecoilRoot initializeState={initializeAllTokensState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <AllTokens />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(mockGetAllTokens).toHaveBeenCalledTimes(1);
      expect(screen.getByText('All tokens error')).toBeVisible();
    });
  });

  test('All my tokens errors are displayed correctly', async () => {
    mockGetAllTokensOwnedBy.mockRejectedValue({ message: 'All my tokens error' });

    render(
      <RecoilRoot initializeState={initializeMyTokensState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <AllTokens />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(mockGetAllTokensOwnedBy).toHaveBeenCalledTimes(1);
      expect(screen.getByText('All my tokens error')).toBeVisible();
    });
  });

  test('Clicking back button correctly updates viewState', async () => {
    mockGetAllTokens.mockResolvedValueOnce([]);
    const viewStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeAllTokensState}>
        <RecoilObserver node={viewState} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <AllTokens />
        </React.Suspense>
      </RecoilRoot>,
    );

    const backButton = screen.getByTestId('backButton');

    await userEvent.click(backButton);

    await waitFor(() => {
      expect(viewStateObserver).toHaveBeenCalledTimes(2);
      expect(viewStateObserver).toHaveBeenCalledWith('allTokens');
      expect(viewStateObserver).toHaveBeenCalledWith('tokenQuery');
    });
  });
});
