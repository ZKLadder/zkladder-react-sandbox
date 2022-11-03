import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchSidebar from '../../../components/manageProjects/SearchSidebar';
import { contractAddressSearch, networkFiltersState } from '../../../state/page';
import networks from '../../../constants/networks';

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

describe('SearchSidebar component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter>
          <SearchSidebar />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MANAGE MY PROJECTS')).toBeVisible();
      expect(screen.getByText('Find, edit and manage all of your deployed projects')).toBeVisible();
      expect(screen.getByText('NEW PROJECT')).toBeVisible();
      Object.values(networks).forEach((network) => {
        if (!network.hide) expect(screen.getByText(network.label.toUpperCase())).toBeVisible();
      });
      expect(screen.getByText('Having issues? Questions?')).toBeVisible();
    });
  });

  test('Address search filter correctly updates state', async () => {
    const viewStateObserver = jest.fn();
    render(
      <RecoilRoot>
        <RecoilObserver node={contractAddressSearch} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <MemoryRouter>
            <SearchSidebar />
          </MemoryRouter>
        </React.Suspense>
      </RecoilRoot>,
    );

    await userEvent.type(screen.getByTestId('addressSearch'), '0xmockcontractsearch');
    await waitFor(() => {
      expect(viewStateObserver).toHaveBeenCalledWith('0xmockcontractsearch');
    });
  });

  test('Network filter correctly updates state', async () => {
    const viewStateObserver = jest.fn();
    render(
      <RecoilRoot>
        <RecoilObserver node={networkFiltersState} onChange={viewStateObserver} />
        <React.Suspense fallback={<p>Loading...</p>}>
          <MemoryRouter>
            <SearchSidebar />
          </MemoryRouter>
        </React.Suspense>
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('checkbox-1'));
    await userEvent.click(screen.getByTestId('checkbox-137'));

    await waitFor(() => {
      expect(viewStateObserver).toHaveBeenCalledWith(['3', '4', '5', '100', '1337', '31337', '80001']);
    });
  });
});
