// Renders contracts/metrics by default
// Renders contracts with appopriate filters
// New project button works

import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AllProjects from '../../../components/manageProjects/AllProjects';
import { contractsState } from '../../../state/contract';
import { contractAddressSearch, networkFiltersState } from '../../../state/page';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: jest.fn(),
  },
}));

jest.mock('../../../components/manageProjects/ProjectBox', () => ({
  __esModule: true,
  default: ({ contract }:{contract: {[key: string]:any}}) => <p>{contract.address}</p>,
}));

jest.mock('../../../utils/blockchainData', () => ({
  generateNftMetrics: () => ({
    totalMinted: '100 Minted',
    totalProjects: '5 Projects',
    totalRevenue: '25.50',
    totalTrades: '11 Trades',
  }),
}));

const contracts = [
  { address: '0xcontract10000000000000000000000000000000', chainId: '1', templateId: '1' },
  { address: '0xcontract20000000000000000000000000000000', chainId: '1', templateId: '1' },
  { address: '0xcontract30000000000000000000000000000000', chainId: '3', templateId: '1' },
  { address: '0xcontract40000000000000000000000000000000', chainId: '3', templateId: '1' },
  { address: '0xcontract50000000000000000000000000000000', chainId: '4', templateId: '1' },
  { address: '0xcontract60000000000000000000000000000000', chainId: '4', templateId: '1' },

];

const initializeWithoutFilters = (settings: any) => {
  settings.set(contractsState, contracts);
};

const initializeWithFilters = (settings: any) => {
  settings.set(contractsState, contracts);
  settings.set(networkFiltersState, '3');
};

const initializeWithAddressSearch = (settings: any) => {
  settings.set(contractsState, contracts);
  settings.set(contractAddressSearch, '0xcontract50000000000000000000000000000000');
};

describe('All projects tests', () => {
  beforeEach(() => {
    // Silence key prop error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeWithoutFilters}>
        <MemoryRouter>
          <AllProjects />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      // Metrics
      expect(screen.getByText('100 Minted')).toBeVisible();
      expect(screen.getByText('5 Projects')).toBeVisible();
      expect(screen.getByText('$25.50')).toBeVisible();
      expect(screen.getByText('11 Trades')).toBeVisible();

      // Contracts
      expect(screen.getByText('0xcontract10000000000000000000000000000000')).toBeVisible();
      expect(screen.getByText('0xcontract20000000000000000000000000000000')).toBeVisible();
      expect(screen.getByText('0xcontract30000000000000000000000000000000')).toBeVisible();
      expect(screen.getByText('0xcontract40000000000000000000000000000000')).toBeVisible();
      expect(screen.getByText('0xcontract50000000000000000000000000000000')).toBeVisible();
      expect(screen.getByText('0xcontract60000000000000000000000000000000')).toBeVisible();

      // Create new project button
      expect(screen.getByText('NEW PROJECT')).toBeVisible();
    });
  });

  test('It renders correctly with an address filter', async () => {
    render(
      <RecoilRoot initializeState={initializeWithAddressSearch}>
        <MemoryRouter>
          <AllProjects />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      // Metrics
      expect(screen.getByText('100 Minted')).toBeVisible();
      expect(screen.getByText('5 Projects')).toBeVisible();
      expect(screen.getByText('$25.50')).toBeVisible();
      expect(screen.getByText('11 Trades')).toBeVisible();

      // Contracts
      expect(screen.queryByText('0xcontract10000000000000000000000000000000')).not.toBeInTheDocument();
      expect(screen.queryByText('0xcontract20000000000000000000000000000000')).not.toBeInTheDocument();
      expect(screen.queryByText('0xcontract30000000000000000000000000000000')).not.toBeInTheDocument();
      expect(screen.queryByText('0xcontract40000000000000000000000000000000')).not.toBeInTheDocument();
      expect(screen.getByText('0xcontract50000000000000000000000000000000')).toBeVisible();
      expect(screen.queryByText('0xcontract60000000000000000000000000000000')).not.toBeInTheDocument();

      // Create new project button
      expect(screen.getByText('NEW PROJECT')).toBeVisible();
    });
  });

  test('It renders correctly with network filters', async () => {
    render(
      <RecoilRoot initializeState={initializeWithFilters}>
        <MemoryRouter>
          <AllProjects />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      // Metrics
      expect(screen.getByText('100 Minted')).toBeVisible();
      expect(screen.getByText('5 Projects')).toBeVisible();
      expect(screen.getByText('$25.50')).toBeVisible();
      expect(screen.getByText('11 Trades')).toBeVisible();

      // Contracts
      expect(screen.queryByText('0xcontract10000000000000000000000000000000')).not.toBeInTheDocument();
      expect(screen.queryByText('0xcontract20000000000000000000000000000000')).not.toBeInTheDocument();
      expect(screen.getByText('0xcontract30000000000000000000000000000000')).toBeVisible();
      expect(screen.getByText('0xcontract40000000000000000000000000000000')).toBeVisible();
      expect(screen.queryByText('0xcontract50000000000000000000000000000000')).not.toBeInTheDocument();
      expect(screen.queryByText('0xcontract60000000000000000000000000000000')).not.toBeInTheDocument();

      // Create new project button
      expect(screen.getByText('NEW PROJECT')).toBeVisible();
    });
  });
});
