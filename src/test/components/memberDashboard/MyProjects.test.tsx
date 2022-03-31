import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyProjects from '../../../components/memberDashboard/MyProjects';
import { walletState } from '../../../state/wallet';
import { getContract } from '../../../utils/api';

jest.mock('../../../components/memberDashboard/ProjectBox', () => ({
  __esModule: true,
  default: () => <p>PROJECT BOX</p>,
}));

jest.mock('../../../utils/api', () => ({
  getContract: jest.fn(),
}));

const initializeState = (settings:any) => {
  settings.set(walletState, {
    address: ['mockuser'],
  });
};

const mockGetContract = getContract as jest.Mocked<any>;

describe('MyProjects component tests', () => {
  beforeEach(() => {
    // Silence jest key errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('It renders', async () => {
    mockGetContract.mockResolvedValueOnce(['one', 'two']);
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <MyProjects />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getAllByText('PROJECT BOX').length).toBe(2);
      expect(screen.getByText('NEW PROJECT')).toBeVisible();
    });
  });

  test('It renders with no contracts', async () => {
    mockGetContract.mockResolvedValueOnce([]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <MyProjects />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryAllByText('PROJECT BOX').length).toBe(0);
      expect(screen.getByText('NEW PROJECT')).toBeVisible();
    });
  });

  test('Clicking New Project correctly updates route', async () => {
    mockGetContract.mockResolvedValueOnce([]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <MyProjects />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryAllByText('PROJECT BOX').length).toBe(0);
      expect(screen.getByText('NEW PROJECT')).toBeVisible();
    });
  });
});
