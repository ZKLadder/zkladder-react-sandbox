import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popover from '../../../components/shared/Popover';

describe('Popover tests', () => {
  test('It renders', async () => {
    render(
      <div>
        <Popover className="mock" header={<p>HEADER</p>}>
          <p>TEST1</p>
          <p>TEST2</p>
          <p>TEST3</p>
        </Popover>
        ,
        <p>EXTERNAL ELEMENT</p>
        ,
      </div>,
    );

    expect(screen.getByText('HEADER')).toBeVisible();

    expect(screen.getByTestId('parent')).toHaveAttribute('class', 'mock options-hidden');

    await userEvent.click(screen.getByText('HEADER'));

    await waitFor(() => {
      expect(screen.getByTestId('parent')).toHaveAttribute('class', 'mock options');
    });

    await userEvent.click(screen.getByText('EXTERNAL ELEMENT'));

    await waitFor(() => {
      expect(screen.getByTestId('parent')).toHaveAttribute('class', 'mock options-hidden');
    });
  });
});
