import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import MyProjects from '../../../components/memberDashboard/MyProjects';
import { walletState } from '../../../state/wallet';
import { contractsState } from '../../../state/contract';

jest.mock('../../../components/manageProjects/ProjectBox', () => ({
  __esModule: true,
  default: () => <p>PROJECT BOX</p>,
}));

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));

const initializeState = (settings:any) => {
  settings.set(walletState, {
    address: ['mockuser'],
  });
  settings.set(contractsState, [
    { address: '0xmockContract' },
    { address: '0xmockContract2' },
  ]);
};

const initializeNoContracts = (settings:any) => {
  settings.set(walletState, {
    address: ['mockuser'],
  });
  settings.set(contractsState, []);
};

describe('MyProjects component tests', () => {
  beforeEach(() => {
    // Silence jest key errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('It renders', async () => {
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
    render(
      <RecoilRoot initializeState={initializeNoContracts}>
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
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Routes>
            <Route path="/deploy" element={<p>DEPLOY</p>} />
            <Route path="*" element={<MyProjects />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByText('NEW PROJECT'));

    await waitFor(() => {
      expect(screen.getByText('DEPLOY')).toBeVisible();
    });
  });
});
