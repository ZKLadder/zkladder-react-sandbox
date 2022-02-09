import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import Sidebar from '../../../components/onboarding/Sidebar';
import { onboardingState } from '../../../state/onboarding';
import { walletState } from '../../../state/wallet';

const initializeState = (settings:any) => {
  settings.set(onboardingState, {
    currentStep: 2,
  });

  settings.set(walletState, {
    isConnected: true,
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
      expect(screen.getByText('MINT YOUR ZKLADDER MEMBER NFT')).toBeVisible();
      expect(screen.getByText('CONNECT YOUR WALLET')).toBeVisible();
      expect(screen.getByText('CONNECT YOUR WALLET')).toHaveAttribute('class', 'sidebar-step-text-activated');
      expect(screen.getByText('UPLOAD TOKEN SEED')).toBeVisible();
      expect(screen.getByText('PREVIEW AND MINT')).toBeVisible();
      expect(screen.getByText('WELCOME TO ZKLADDER')).toBeVisible();
    });
  });

  test('Correctly renders when currentStep is not 1', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Sidebar />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MINT YOUR ZKLADDER MEMBER NFT')).toBeVisible();
      expect(screen.getByText('CONNECT YOUR WALLET')).toBeVisible();
      expect(screen.getByText('UPLOAD TOKEN SEED')).toBeVisible();
      expect(screen.getByText('UPLOAD TOKEN SEED')).toHaveAttribute('class', 'sidebar-step-text-activated');
      expect(screen.getByText('PREVIEW AND MINT')).toBeVisible();
      expect(screen.getByText('WELCOME TO ZKLADDER')).toBeVisible();
    });
  });
});
