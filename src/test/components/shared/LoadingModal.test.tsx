import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import LoadingModal from '../../../components/shared/LoadingModal';
import { loadingState } from '../../../state/page';

const initializeState = (settings:any) => {
  settings.set(loadingState, {
    loading: true,
    header: 'loading header',
    content: 'loading content',
  });
};

const initializeLoadedState = (settings:any) => {
  settings.set(loadingState, {
    loading: false,
  });
};

describe('LoadingModal tests', () => {
  test('It renders an open modal', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <LoadingModal />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('loading header')).toBeVisible();
      expect(screen.getByText('loading content')).toBeVisible();
    });
  });

  test('It renders a closed modal', async () => {
    render(
      <RecoilRoot initializeState={initializeLoadedState}>
        <LoadingModal />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryByText('loading header')).not.toBeInTheDocument();
      expect(screen.queryByText('loading content')).not.toBeInTheDocument();
    });
  });
});
