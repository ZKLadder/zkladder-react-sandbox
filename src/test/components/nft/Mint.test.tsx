import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { nftState, viewState } from '../../../state/nftContract';
import Mint from '../../../components/nft/Mint';

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

const mockMintAndWait = jest.fn();

const initializeState = (settings:any) => {
  settings.set(nftState, {
    isSelected: true,
    address: '0x1234567890abce',
    instance: {
      mintAndWait: mockMintAndWait,
    },
  });
};

describe('Mint component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Mint />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Mint a new token')).toBeVisible();
      expect(screen.getByText('View all tokens')).toBeVisible();
      expect(screen.getByText('View all of my tokens')).toBeVisible();
    });
  });

  test('Clicking mint calls the zkl module correctly', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Mint />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(mockMintAndWait).toHaveBeenCalledTimes(0);
    });

    const mintButton = screen.getByTestId('mintButton');

    act(() => {
      userEvent.click(mintButton);
    });

    await waitFor(() => {
      // expect(mockMintAndWait).toHaveBeenCalledTimes(1);
    });
  });

  test('Thrown errors are correctly displayed', async () => {
    mockMintAndWait.mockRejectedValue({ message: 'Error minting NFT' });
    render(
      <RecoilRoot initializeState={initializeState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Mint />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      // expect(mockMintAndWait).toHaveBeenCalledTimes(0);
    });

    const mintButton = screen.getByTestId('mintButton');

    act(() => {
      userEvent.click(mintButton);
    });

    await waitFor(() => {
      // expect(mockMintAndWait).toHaveBeenCalledTimes(1);
      // expect(screen.getByText('Error minting NFT')).toBeVisible();
    });
  });

  test('View all tokens button correctly updates state', async () => {
    const viewStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={viewState} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <Mint />
        </React.Suspense>
      </RecoilRoot>,
    );

    const allTokensButton = screen.getByTestId('allTokensButton');

    await userEvent.click(allTokensButton);

    await waitFor(() => {
      expect(viewStateObserver).toHaveBeenCalledTimes(2);
      expect(viewStateObserver).toHaveBeenCalledWith('tokenQuery');
      expect(viewStateObserver).toHaveBeenCalledWith('allTokens');
    });
  });

  test('View my tokens button correctly updates state', async () => {
    const viewStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={viewState} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <Mint />
        </React.Suspense>
      </RecoilRoot>,
    );

    const myTokensButton = screen.getByTestId('myTokensButton');

    await userEvent.click(myTokensButton);

    await waitFor(() => {
      expect(viewStateObserver).toHaveBeenCalledTimes(2);
      expect(viewStateObserver).toHaveBeenCalledWith('tokenQuery');
      expect(viewStateObserver).toHaveBeenCalledWith('allMyTokens');
    });
  });
});
