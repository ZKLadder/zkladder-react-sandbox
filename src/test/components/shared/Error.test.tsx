import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Error from '../../../components/shared/Error';

describe('Error component tests', () => {
  test('It renders', async () => {
    render(
      <Error text="An error" />,
    );

    await waitFor(() => {
      expect(screen.getByText('An error')).toBeVisible();
    });
  });
});
