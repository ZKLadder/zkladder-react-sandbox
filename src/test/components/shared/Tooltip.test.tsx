import React from 'react';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Tooltip from '../../../components/shared/Tooltip';

describe('Tooltip tests', () => {
  test('It renders', async () => {
    render(
      <Tooltip
        header="mock header"
        body="mock body"
        className="test-class"
      />,
    );

    act(() => {
      fireEvent.mouseOver(screen.getByTestId('icon'));
    });

    await waitFor(() => {
      expect(screen.getByText('mock header')).toBeVisible();
      expect(screen.getByText('mock body')).toBeVisible();
      expect(screen.getByTestId('icon')).toHaveAttribute('class', 'test-class');
    });
  });
});
