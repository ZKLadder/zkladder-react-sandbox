import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Unauthenticated from '../../../components/unauthenticated/Unauthenticated';

jest.mock('../../../components/navbar/Navbar', () => ({
  __esModule: true,
  default: () => <p>NAVBAR</p>,
}));

jest.mock('../../../components/unauthenticated/UnauthenticatedSidebar', () => ({
  __esModule: true,
  default: () => <p>UNAUTHENTICATEDSIDEBAR</p>,
}));

jest.mock('../../../components/unauthenticated/EventsMenu', () => ({
  __esModule: true,
  default: () => <p>EVENTSMENU</p>,
}));
jest.mock('../../../components/unauthenticated/PostsMenu', () => ({
  __esModule: true,
  default: () => <p>POSTSMENU</p>,
}));

describe('Unauthenticated component', () => {
  test('Correctly renders child components', async () => {
    render(
      <Unauthenticated />
    );

    await waitFor(() => {
      expect(screen.getByText('NAVBAR')).toBeVisible();
      expect(screen.getByText('UNAUTHENTICATEDSIDEBAR')).toBeVisible();
      expect(screen.getByText('EVENTSMENU')).toBeVisible();
      expect(screen.queryByText('POSTSMENU')).toBeVisible();
    });
  });
});
