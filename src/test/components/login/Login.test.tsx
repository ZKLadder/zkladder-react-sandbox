import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../../components/login/Login';
import { walletState } from '../../../state/wallet';

import { connect, apiSession } from '../../../utils/walletConnect';

const initializeWalletState = (settings:any) => {
  settings.set(walletState, {
    reason: 'An error that was thrown elsewhere',
  });
};

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));
jest.mock('../../../utils/walletConnect', () => ({
  connect: jest.fn(),
  apiSession: jest.fn(),
}));

const mockConnect = connect as jest.Mocked<any>;
const mockApiSession = apiSession as jest.Mocked<any>;

describe('Login component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot>
        <Login />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('logo')).toBeVisible();
      expect(screen.getByTestId('connectButton')).toBeVisible();
    });
  });

  test('Login workflow', async () => {
    const walletStateObserver = jest.fn();
    const mockWallet = {
      address: 'mockAddress',
      balance: 1111,
      provider: { provider: 'mock' },
      chainId: 1234,
    };

    mockConnect.mockResolvedValueOnce(mockWallet);
    // mockZKLadder.mockReturnValueOnce({ mock: 'ZKL' });

    render(
      <RecoilRoot>
        <RecoilObserver node={walletState} onChange={walletStateObserver} />
        <Login />
      </RecoilRoot>,
    );
    const connectButton = screen.getByTestId('connectButton');

    await userEvent.click(connectButton);

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockApiSession).toHaveBeenCalledWith(
        { provider: 'mock' },
        'mockAddress',
      );
      expect(walletStateObserver).toHaveBeenCalledWith({
        ...mockWallet,
        isConnected: true,
        isMember: true,
      });
    });
  });

  test('Correctly displays errors', async () => {
    mockConnect.mockRejectedValueOnce({ message: 'User refused to connect' });

    render(
      <RecoilRoot>
        <Login />
      </RecoilRoot>,
    );
    const connectButton = screen.getByTestId('connectButton');

    await userEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByText('User refused to connect')).toBeVisible();
    });
  });

  test('Correctly displays errors present in wallet state', async () => {
    render(
      <RecoilRoot initializeState={initializeWalletState}>
        <Login />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('An error that was thrown elsewhere')).toBeVisible();
    });
  });
});
