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
      expect(screen.getByText('Welcome to the ZKLadder DAO and the overall ZKLadder Community. We are a community of developers, creatives, entrepreneurs and industry experts that support curated DAOs and NFT projects with an emphasis on support.')).toBeVisible();
      expect(screen.getByText('0')).toBeVisible();
      expect(screen.getByText('Creators')).toBeVisible();
      expect(screen.getByText('25')).toBeVisible();
      expect(screen.getByText('Members')).toBeVisible();
      expect(screen.getByText('2')).toBeVisible();
      expect(screen.getByText('Ventures Launched')).toBeVisible();
      expect(screen.getByText('5')).toBeVisible();
      expect(screen.getByText('Contracts Deployed')).toBeVisible();
    });
  });
});
