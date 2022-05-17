import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useParams } from 'react-router-dom';
import ManageProjects from '../../../components/manageProjects/ManageProjects';

jest.mock('../../../components/manageProjects/SearchSidebar', () => ({
  __esModule: true,
  default: () => <p>SEARCH SIDEBAR</p>,
}));

jest.mock('../../../components/manageProjects/AllProjects', () => ({
  __esModule: true,
  default: () => <p>ALL PROJECTS</p>,
}));

jest.mock('../../../components/manageProjects/ProjectSidebar', () => ({
  __esModule: true,
  default: () => <p>PROJECT SIDEBAR</p>,
}));

jest.mock('../../../components/manageProjects/ProjectBody', () => ({
  __esModule: true,
  default: () => <p>PROJECT BODY</p>,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));

const mockUseParams = useParams as jest.Mocked<any>;

describe('ManageProjects component tests', () => {
  test('It renders', async () => {
    mockUseParams.mockReturnValueOnce({});
    render(
      <RecoilRoot>
        <MemoryRouter>
          <ManageProjects />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('SEARCH SIDEBAR')).toBeVisible();
    expect(screen.getByText('ALL PROJECTS')).toBeVisible();
  });

  test('It renders with an address', async () => {
    mockUseParams.mockReturnValueOnce({ address: 'mockAddress' });
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/route/0x123456789']}>
          <ManageProjects />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByText('PROJECT SIDEBAR')).toBeVisible();
    expect(screen.getByText('PROJECT BODY')).toBeVisible();
  });
});
