import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import NotConnected from '../../components/NotConnected';

describe('NotConnected component tests', () => {
  test('Displays text correctly', async () => {
    render(
      <RecoilRoot>
        <NotConnected />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Please connect your wallet')).toBeVisible();
    });
  });
});
