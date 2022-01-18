import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavBar from '../../components/Navbar';
import { connect, disconnect } from '../../utils/walletConnect';
import { walletState } from '../../state/wallet';

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));

jest.mock('../../utils/walletConnect', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

const mockConnect = connect as jest.Mocked<any>;
const mockDisconnect = disconnect as jest.Mocked<any>;

describe('Navbar tests', () => {
  afterEach(() => {
    mockConnect.mockClear();
    mockDisconnect.mockClear();
  });

  test('Clicking disconnect calls the walletConnect disconnect function', async () => {
    const mockWalletState = {
      isConnected: true,
      address: ['test'],
      balance: 12345678,
      chainId: 1,
      provider: { on: jest.fn(), request: jest.fn() },
    };

    render(
      <RecoilRoot initializeState={(settings:any) => {
        settings.set(walletState, mockWalletState);
      }}
      >
        <NavBar />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('ZKLadder')).toBeVisible();
      expect(screen.getByText('Ethereum : test')).toBeVisible();
      expect(screen.getByText('Disconnect Wallet')).toBeVisible();
    });

    userEvent.click(screen.getByTestId('disconnectButton'));

    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});
