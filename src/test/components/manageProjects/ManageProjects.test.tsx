import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManageProjects from '../../../components/manageProjects/ManageProjects';

jest.mock('../../../components/manageProjects/SearchSidebar', () => ({
  __esModule: true,
  default: () => <p>SEARCH SIDEBAR</p>,
}));

jest.mock('../../../components/manageProjects/AllProjects', () => ({
  __esModule: true,
  default: () => <p>ALL PROJECTS</p>,
}));

describe('Body component tests', () => {
  test('It renders', async () => {
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
});
