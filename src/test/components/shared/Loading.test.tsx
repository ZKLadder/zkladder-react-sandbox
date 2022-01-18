import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Loading from '../../../components/shared/Loading';

describe('Loading component tests', () => {
  test('It renders', async () => {
    render(
      <Loading text="Loading some data" />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loadingSpinner')).toBeVisible();
      expect(screen.getByText('Loading some data')).toBeVisible();
    });
  });
});
