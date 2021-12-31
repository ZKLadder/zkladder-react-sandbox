import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavBar from '../../components/Navbar';
import { connect, disconnect } from '../../utils/walletConnect';

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

  test('Connect button is visible by default', async () => {
    render(
      <RecoilRoot>
        <NavBar />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('ZKLadder')).toBeVisible();
      expect(screen.getByText('Connect Wallet')).toBeVisible();
    });
  });

  test('Clicking connect calls the walletConnect function', async () => {
    const mockWalletState = {
      address: ['test'],
      balance: 12345678,
      chainId: '0x1',
      provider: { on: jest.fn(), request: jest.fn() },
    };
    mockConnect.mockResolvedValue(mockWalletState);

    mockWalletState.provider.request.mockResolvedValueOnce(12345678);
    mockWalletState.provider.request.mockResolvedValueOnce('0x1');

    render(
      <RecoilRoot>
        <NavBar />
      </RecoilRoot>,
    );

    userEvent.click(screen.getByTestId('connectButton'));

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(screen.getByText('ZKLadder')).toBeVisible();
      expect(screen.getByText('Ethereum : test')).toBeVisible();
      expect(screen.getByText('Disconnect Wallet')).toBeVisible();
    });
  });

  test('Clicking disconnect calls the walletConnect disconnect function', async () => {
    const mockWalletState = {
      address: ['test'],
      balance: 12345678,
      chainId: '0x1',
      provider: { on: jest.fn(), request: jest.fn() },
    };
    mockConnect.mockResolvedValue(mockWalletState);

    mockWalletState.provider.request.mockResolvedValueOnce(12345678);
    mockWalletState.provider.request.mockResolvedValueOnce('0x1');

    render(
      <RecoilRoot>
        <NavBar />
      </RecoilRoot>,
    );

    userEvent.click(screen.getByTestId('connectButton'));

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(screen.getByText('ZKLadder')).toBeVisible();
      expect(screen.getByText('Ethereum : test')).toBeVisible();
      expect(screen.getByText('Disconnect Wallet')).toBeVisible();
    });

    userEvent.click(screen.getByTestId('disconnectButton'));

    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
      expect(screen.getByText('ZKLadder')).toBeVisible();
      expect(screen.queryByText('Ethereum : test')).not.toBeInTheDocument();
      expect(screen.queryByText('Disconnect Wallet')).not.toBeInTheDocument();
      expect(screen.getByText('Connect Wallet')).toBeVisible();
    });
  });
});
