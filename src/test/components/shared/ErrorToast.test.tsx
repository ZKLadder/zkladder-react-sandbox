import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import ErrorToast from '../../../components/shared/ErrorToast';
import { errorState } from '../../../state/page';

const initializeState = (settings:any) => {
  settings.set(errorState, {
    showError: false,
  });
};

const initializeErrorState = (settings:any) => {
  settings.set(errorState, {
    showError: true,
    content: 'A mock error has occured somewhere',
  });
};

describe('ErrorToast tests', () => {
  test('It renders with an error', async () => {
    render(
      <RecoilRoot initializeState={initializeErrorState}>
        <ErrorToast />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('A mock error has occured somewhere')).toBeVisible();
    });
  });

  test('It renders wthout an error', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <ErrorToast />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryByText('A mock error has occured somewhere')).not.toBeInTheDocument();
    });
  });
});
