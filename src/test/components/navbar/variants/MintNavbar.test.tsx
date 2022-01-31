import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MintNavbar from '../../../../components/navbar/variants/MintNavbar';
import { connect, disconnect, apiSession } from '../../../../utils/walletConnect';
import { walletState } from '../../../../state/wallet';

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));

jest.mock('../../../../utils/walletConnect', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  apiSession: jest.fn(),
}));

const mockConnect = connect as jest.Mocked<any>;
const mockDisconnect = disconnect as jest.Mocked<any>;
const mockApiSession = apiSession as jest.Mocked<any>;

describe('Navbar tests', () => {
  afterEach(() => {
    mockConnect.mockClear();
    mockDisconnect.mockClear();
    mockApiSession.mockClear();
  });

  test('It renders when wallet is not connected', async () => {
    const mockWalletState = {
      isConnected: false,
    };

    render(
      <RecoilRoot initializeState={(settings:any) => {
        settings.set(walletState, mockWalletState);
      }}
      >
        <MintNavbar />
      </RecoilRoot>,
    );

    expect(screen.getByText('ZKL MEMBER TOKEN MINT')).toBeVisible();
    expect(screen.getByText('MEMBERS CONNECT YOUR WALLET')).toBeVisible();
  });

  test('Connect wallet workflow', async () => {
    const mockWalletState = {
      isConnected: false,
    };

    render(
      <RecoilRoot initializeState={(settings:any) => {
        settings.set(walletState, mockWalletState);
      }}
      >
        <MintNavbar />
      </RecoilRoot>,
    );

    expect(screen.getByText('ZKL MEMBER TOKEN MINT')).toBeVisible();
    expect(screen.getByText('MEMBERS CONNECT YOUR WALLET')).toBeVisible();

    mockConnect.mockResolvedValue({
      address: ['0x1234abcde0987'],
      chainId: 1,
    });

    userEvent.click(
      screen.getByTestId('connectButton'),
    );

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockApiSession).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Ethereum : 0x1234...0987')).toBeVisible();
    });
  });

  test('Disconnect wallet workflow', async () => {
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
        <MintNavbar />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Ethereum : test')).toBeVisible();
    });

    userEvent.click(screen.getByTestId('disconnectButton'));

    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});
