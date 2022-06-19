import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UnauthenticatedSidebar from '../../../components/unauthenticated/UnauthenticatedSidebar';

describe('Unauthenticated Sidebar component', () => {
  test('It renders', async () => {
    render(
      <UnauthenticatedSidebar />,
    );

    await waitFor(() => {
      expect(screen.getByAltText('zkl-logo')).toBeVisible();
      expect(screen.getByText('Welcome to the ZKLadder Venture Studio. We are a community of industry experts that build and support a curated portfolio of ventures in Web3.')).toBeVisible();
      expect(screen.getByText('Get in touch to learn more')).toHaveAttribute('href', 'https://www.zkladder.com/#join');
      /* expect(screen.getByText('0')).toBeVisible();
      expect(screen.getByText('Creators')).toBeVisible();
      expect(screen.getByText('25')).toBeVisible();
      expect(screen.getByText('Members')).toBeVisible();
      expect(screen.getByText('2')).toBeVisible();
      expect(screen.getByText('Ventures Launched')).toBeVisible();
      expect(screen.getByText('5')).toBeVisible();
      expect(screen.getByText('Contracts Deployed')).toBeVisible(); */
    });
  });
});
