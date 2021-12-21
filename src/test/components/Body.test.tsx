import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import Body from '../../components/Body';
import { walletState } from '../../state/wallet';

const initializeState = (settings:any) => {
  settings.set(walletState, { isConnected: true });
};

describe('Body component tests', () => {
  test('When isConnected is false, display correct message', async () => {
    render(
      <RecoilRoot>
        <Body />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Please connect your wallet')).toBeVisible();
    });
  });

  test('When isConnected is true, display correct message', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Body />
      </RecoilRoot>,
    );

    // @TODO expand this test suite once routing has been properly added
    await waitFor(() => {
      expect(screen.queryByText('Please connect your wallet')).not.toBeInTheDocument();
    });
  });
});
