import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SidebarStep from '../../../components/shared/SidebarStep';

describe('SidebarStep tests', () => {
  test('It renders an active sidebar step', async () => {
    render(
      <SidebarStep
        step={123}
        text="Sidebar text"
        isActivated
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('123')).toBeVisible();
      expect(screen.getByText('Sidebar text')).toBeVisible();
      expect(screen.getByTestId('parent')).toHaveAttribute('class', 'sidebar-step-activated list-group-item');
    });
  });

  test('It renders an inactive sidebar step', async () => {
    render(
      <SidebarStep
        step={123}
        text="Sidebar text"
        isActivated={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('123')).toBeVisible();
      expect(screen.getByText('Sidebar text')).toBeVisible();
      expect(screen.getByTestId('parent')).toHaveAttribute('class', 'sidebar-step list-group-item');
    });
  });
});
