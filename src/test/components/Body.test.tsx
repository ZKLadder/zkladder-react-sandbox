import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Body from '../../components/Body';
import { getContract } from '../../utils/api';
import { walletState } from '../../state/wallet';

jest.mock('../../components/nft/Nft', () => ({
  __esModule: true,
  default: () => <p>NFT</p>,
}));

jest.mock('../../components/ipfs/Ipfs', () => ({
  __esModule: true,
  default: () => <p>IPFS</p>,
}));

jest.mock('../../components/memberDashboard/Dashboard', () => ({
  __esModule: true,
  default: () => <p>AUTHENTICATED DASHBOARD</p>,
}));

jest.mock('../../components/deploy/Deploy', () => ({
  __esModule: true,
  default: () => <p>DEPLOY PROJECT</p>,
}));

jest.mock('../../components/manageProjects/ManageProjects', () => ({
  __esModule: true,
  default: () => <p>MANAGE PROJECTS</p>,
}));

jest.mock('@zkladder/zkladder-sdk-ts', () => ({}));

jest.mock('../../utils/api', () => ({
  getContract: jest.fn(),
}));

const initializeState = (settings:any) => {
  settings.set(walletState, {
    isConnected: true,
    address: ['0xmockuser'],
  });
};

describe('Body component tests', () => {
  beforeEach(() => {
    // Silence CSS margin warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders the default route and queries the users contracts', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Body />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('AUTHENTICATED DASHBOARD')).toBeVisible();

    await waitFor(() => {
      expect(getContract).toHaveBeenCalledWith({
        userAddress: '0xmockuser',
      });
    });
  });

  test('It renders the ipfs route', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/ipfs']}>
          <Body />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('IPFS')).toBeVisible();
  });

  test('It renders the nft route', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/nft']}>
          <Body />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('NFT')).toBeVisible();
  });

  test('It renders the Deploy project route', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/deploy']}>
          <Body />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('DEPLOY PROJECT')).toBeVisible();
  });

  test('It renders the Manage Projects route', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/projects']}>
          <Body />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('MANAGE PROJECTS')).toBeVisible();
  });

  test('Project path with address suffix renders manage projects', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/projects/0x1234567']}>
          <Body />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('MANAGE PROJECTS')).toBeVisible();
  });

  test('All other routes fallback to default', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/not-a-real-route']}>
          <Body />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('AUTHENTICATED DASHBOARD')).toBeVisible();
  });
});
