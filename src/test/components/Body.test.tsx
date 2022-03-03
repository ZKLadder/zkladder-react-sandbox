import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Body from '../../components/Body';

jest.mock('../../components/memberNft/Deploy', () => ({
  __esModule: true,
  default: () => <p>DEPLOY MEMBER NFT</p>,
}));

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

describe('Body component tests', () => {
  test('It renders the default route', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter>
          <Body />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('AUTHENTICATED DASHBOARD')).toBeVisible();
  });

  test('It renders the deploy-nft route', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/deploy-nft']}>
          <Body />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('DEPLOY MEMBER NFT')).toBeVisible();
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

  test('All other routes fallback to defaukt', async () => {
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
