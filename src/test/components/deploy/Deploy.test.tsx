import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import Deploy from '../../../components/deploy/Deploy';
import { deployState } from '../../../state/deploy';

jest.mock('../../../components/deploy/Sidebar', () => ({
  __esModule: true,
  default: () => <p>SIDEBAR</p>,
}));

jest.mock('../../../components/deploy/SelectTemplate', () => ({
  __esModule: true,
  default: () => <p>SELECTTEMPLATE</p>,
}));

jest.mock('../../../components/deploy/ConfigureContract', () => ({
  __esModule: true,
  default: () => <p>CONFIGURECONTRACT</p>,
}));
jest.mock('../../../components/deploy/DefineRoles', () => ({
  __esModule: true,
  default: () => <p>DEFINEROLES</p>,
}));
jest.mock('../../../components/deploy/Review', () => ({
  __esModule: true,
  default: () => <p>REVIEW</p>,
}));

const initializeState = (settings:any) => {
  settings.set(deployState, {
    currentStep: 2,
  });
};

describe('Onboarding component', () => {
  test('Correctly renders child components', async () => {
    render(
      <RecoilRoot>
        <Deploy />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('SIDEBAR')).toBeVisible();
      expect(screen.getByText('SELECTTEMPLATE')).toBeVisible();
      expect(screen.queryByText('CONFIGURECONTRACT')).not.toBeInTheDocument();
      expect(screen.queryByText('DEFINEROLES')).not.toBeInTheDocument();
      expect(screen.queryByText('REVIEW')).not.toBeInTheDocument();
    });
  });

  test('Correctly renders when currentStep is not 1', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Deploy />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('SIDEBAR')).toBeVisible();
      expect(screen.queryByText('SELECTTEMPLATE')).not.toBeInTheDocument();
      expect(screen.getByText('CONFIGURECONTRACT')).toBeVisible();
      expect(screen.queryByText('DEFINEROLES')).not.toBeInTheDocument();
      expect(screen.queryByText('REVIEW')).not.toBeInTheDocument();
    });
  });
});
