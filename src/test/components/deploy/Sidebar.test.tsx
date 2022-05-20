import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import Sidebar from '../../../components/deploy/Sidebar';
import { deployState } from '../../../state/deploy';

const initializeState = (settings:any) => {
  settings.set(deployState, {
    currentStep: 2,
  });
};

describe('Onboarding Sidebar component', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot>
        <Sidebar />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('SELECT TEMPLATE')).toBeVisible();
      expect(screen.getByText('SELECT TEMPLATE')).toHaveAttribute('class', 'sidebar-step-text-activated');
      expect(screen.getByText('CONFIGURE SMART CONTRACT')).toBeVisible();
      expect(screen.getByText('DEFINE COMMUNITY ROLES')).toBeVisible();
      expect(screen.getByText('REVIEW AND LAUNCH')).toBeVisible();
    });
  });

  test('Correctly renders when currentStep is not 1', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Sidebar />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('SELECT TEMPLATE')).toBeVisible();
      expect(screen.getByText('CONFIGURE SMART CONTRACT')).toBeVisible();
      expect(screen.getByText('CONFIGURE SMART CONTRACT')).toHaveAttribute('class', 'sidebar-step-text-activated');
      expect(screen.getByText('DEFINE COMMUNITY ROLES')).toBeVisible();
      expect(screen.getByText('REVIEW AND LAUNCH')).toBeVisible();
    });
  });
});
