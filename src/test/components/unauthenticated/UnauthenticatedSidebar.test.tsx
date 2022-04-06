import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UnauthenticatedSidebar from '../../../components/unauthenticated/UnauthenticatedSidebar';

describe('Unauthenticated Sidebar component', () => {
  test('It renders', async () => {
    render(
      <UnauthenticatedSidebar />
    );

    await waitFor(() => {
      expect(screen.getByAltText('zkl-logo')).toBeVisible();
      expect(screen.getByText('Welcome to the ZKLadder DAO and the overall ZKLadder Community. We are a community of developers, creatives, entrepreneurs and industry experts that support curated DAOs and NFT projects with an emphasis on support.')).toBeVisible();
      expect(screen.getByText('125')).toBeVisible();
      expect(screen.getByText('Producers')).toBeVisible();
      expect(screen.getByText('74')).toBeVisible();
      expect(screen.getByText('Members')).toBeVisible();
      expect(screen.getByText('82')).toBeVisible();
      expect(screen.getByText('Partner DAOs Launched')).toBeVisible();
      expect(screen.getByText('150')).toBeVisible();
      expect(screen.getByText('NFTs Minted')).toBeVisible();
    });
  });
});
