import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import ZklRouter from '../../components/Router';

import { getSession } from '../../utils/api';
import { connect } from '../../utils/walletConnect';

const storage = {
  getItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  writable: true,
  value: storage,
});

jest.mock('../../components/navbar/Navbar', () => ({
  __esModule: true,
  default: () => <p>NAVBAR</p>,
}));

jest.mock('../../components/Body', () => ({
  __esModule: true,
  default: () => <p>BODY</p>,
}));

jest.mock('../../components/unauthenticated/Unauthenticated', () => ({
  __esModule: true,
  default: () => <p>LOGIN</p>,
}));

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));

jest.mock('../../utils/api', () => ({
  getSession: jest.fn(),
}));

jest.mock('../../utils/walletConnect', () => ({
  connect: jest.fn(),
}));

const mockGetSession = getSession as jest.Mocked<any>;
const mockConnect = connect as jest.Mocked<any>;

describe('ZklRouter component tests', () => {
  test('useEffect correctly calls dependencies on page load', async () => {
    mockGetSession.mockResolvedValueOnce({ session: true });
    storage.getItem.mockResolvedValueOnce('cachedProvider');
    mockConnect.mockResolvedValueOnce({ provider: { on: jest.fn() } });

    render(
      <RecoilRoot>
        <ZklRouter />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalledTimes(1);
      expect(storage.getItem).toHaveBeenCalledWith('CACHED_WALLET_CONNECTION');
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });
  });

  test('Renders unauthenticated routes when session does not exist', async () => {
    mockGetSession.mockResolvedValueOnce({ session: false });
    storage.getItem.mockResolvedValueOnce('cachedProvider');
    mockConnect.mockResolvedValueOnce({ provider: { on: jest.fn() } });

    render(
      <RecoilRoot>
        <ZklRouter />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('LOGIN')).toBeVisible();
      expect(screen.queryByText('NAVBAR')).not.toBeInTheDocument();
      expect(screen.queryByText('BODY')).not.toBeInTheDocument();
    });
  });

  test('Renders authenticated routes when session does exist', async () => {
    mockGetSession.mockResolvedValueOnce({ session: true });
    storage.getItem.mockResolvedValueOnce('cachedProvider');
    mockConnect.mockResolvedValueOnce({ provider: { on: jest.fn() } });

    render(
      <RecoilRoot>
        <ZklRouter />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryByText('LOGIN')).not.toBeInTheDocument();
      expect(screen.getByText('BODY')).toBeVisible();
    });
  });
});
