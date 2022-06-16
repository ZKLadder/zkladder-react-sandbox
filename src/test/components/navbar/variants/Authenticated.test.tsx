import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Authenticated from '../../../../components/navbar/variants/Authenticated';
import { disconnect } from '../../../../utils/walletConnect';
import { walletState } from '../../../../state/wallet';

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));

jest.mock('../../../../utils/walletConnect', () => ({
  disconnect: jest.fn(),
}));

const mockDisconnect = disconnect as jest.Mocked<any>;

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
  });

  test('Disconnect wallet workflow', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Authenticated />
        </MemoryRouter>
      </RecoilRoot>,
    );

    userEvent.click(screen.getByTestId('disconnectButton'));

    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});
