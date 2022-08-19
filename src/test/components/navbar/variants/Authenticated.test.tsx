import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Authenticated from '../../../../components/navbar/variants/Authenticated';
import { disconnect, switchChain } from '../../../../utils/walletConnect';
import { walletState } from '../../../../state/wallet';

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));

jest.mock('../../../../utils/walletConnect', () => ({
  disconnect: jest.fn(),
  switchChain: jest.fn(),
}));

jest.mock('../../../../constants/networks', () => ({
  1: {
    label: 'ETHEREUM',
    chainId: '0x1',
  },
  2: {
    label: 'SECOND',
    chainId: '0x2',
  },
  3: {
    label: 'THIRD',
    chainId: '0x3',
  },
  137: {
    label: 'Polygon',
    chainId: '0x3',
    token: 'MATIC',
  },
}));

const mockDisconnect = disconnect as jest.Mocked<any>;
const mockSwitchChain = switchChain as jest.Mocked<any>;

const initializeState = (settings:any) => {
  settings.set(walletState, {
    isMember: true,
    isConnected: true,
    address: ['0xmockaddresstest'],
    balance: '0x6C6B935B8BBD40000',
    chainId: 137,
  });
};
describe('Navbar tests', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    mockDisconnect.mockClear();
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Authenticated />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('MEMBER DASHBOARD')).toBeVisible();
    expect(screen.getByText('CREATOR TOOLS')).toBeVisible();
    expect(screen.getByText('125 MATIC')).toBeVisible();
    expect(screen.getByText('Polygon : 0xmock...test')).toBeVisible();
    expect(screen.getByTestId('disconnectButton')).toBeVisible();

    await userEvent.click(screen.getByTestId('header'));

    await waitFor(() => {
      expect(screen.getByText('WALLET SETTINGS')).toBeVisible();
      expect(screen.getByText('Copy Wallet Address')).toBeVisible();
      expect(screen.getByText('Disconnect Wallet')).toBeVisible();
    });
  });

  test('Disconnect wallet workflow', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Authenticated />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('header'));

    await userEvent.click(screen.getByText('Disconnect Wallet'));

    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  test('Switch chain workflow', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Authenticated />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('header'));

    await userEvent.click(screen.getByTestId('dropdown'));

    await waitFor(() => {
      expect(screen.getByText('ETHEREUM')).toBeVisible();
      expect(screen.getByText('SECOND')).toBeVisible();
      expect(screen.getByText('THIRD')).toBeVisible();
    });

    await userEvent.click(screen.getByTestId('ETHEREUM'));

    await waitFor(() => {
      expect(mockSwitchChain).toHaveBeenCalledWith('1');
    });
  });
});
