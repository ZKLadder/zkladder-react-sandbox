import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Unauthenticated from '../../../../components/navbar/variants/Unauthenticated';
import { connect, apiSession } from '../../../../utils/walletConnect';
import { walletState } from '../../../../state/wallet';
import { RecoilObserver } from '../../../mocks';
import { errorState } from '../../../../state/page';

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));

jest.mock('../../../../utils/walletConnect', () => ({
  connect: jest.fn(),
  apiSession: jest.fn(),
}));

const mockConnect = connect as jest.Mocked<any>;
const mockApiSession = apiSession as jest.Mocked<any>;

describe('Navbar tests', () => {
  afterEach(() => {
    mockConnect.mockClear();
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
        <Unauthenticated />
      </RecoilRoot>,
    );

    expect(screen.getByText('COMMUNITY DASHBOARD')).toBeVisible();
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
        <Unauthenticated />
      </RecoilRoot>,
    );

    expect(screen.getByText('COMMUNITY DASHBOARD')).toBeVisible();
    expect(screen.getByText('MEMBERS CONNECT YOUR WALLET')).toBeVisible();

    mockConnect.mockResolvedValue({
      address: ['0x1234abcde0987'],
      chainId: 1,
    });

    mockApiSession.mockResolvedValue({
      memberToken: {},
    });

    userEvent.click(
      screen.getByTestId('connectButton'),
    );

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockApiSession).toHaveBeenCalledTimes(1);
    });
  });

  test('Errors correctly update state', async () => {
    const mockWalletState = {
      isConnected: false,
    };

    const errorStateObserver = jest.fn();

    render(
      <RecoilRoot initializeState={(settings:any) => {
        settings.set(walletState, mockWalletState);
      }}
      >
        <RecoilObserver node={errorState} onChange={errorStateObserver} />
        <Unauthenticated />
      </RecoilRoot>,
    );

    expect(screen.getByText('COMMUNITY DASHBOARD')).toBeVisible();
    expect(screen.getByText('MEMBERS CONNECT YOUR WALLET')).toBeVisible();

    mockConnect.mockRejectedValue({
      message: 'UNABLE TO CONNECT',
    });

    userEvent.click(
      screen.getByTestId('connectButton'),
    );

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockApiSession).toHaveBeenCalledTimes(0);
      expect(errorStateObserver).toHaveBeenCalledWith({ showError: true, content: 'UNABLE TO CONNECT' });
    });
  });
});
