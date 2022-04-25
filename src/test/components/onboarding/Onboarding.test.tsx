import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import Onboarding from '../../../components/onboarding/Onboarding';
import { onboardingState } from '../../../state/onboarding';
import { walletState } from '../../../state/wallet';

jest.mock('../../../components/navbar/Navbar', () => ({
  __esModule: true,
  default: () => <p>NAVBAR</p>,
}));

jest.mock('../../../components/onboarding/Sidebar', () => ({
  __esModule: true,
  default: () => <p>SIDEBAR</p>,
}));

jest.mock('../../../components/onboarding/ConnectWallet', () => ({
  __esModule: true,
  default: () => <p>CONNECTWALLET</p>,
}));
jest.mock('../../../components/onboarding/Attestation', () => ({
  __esModule: true,
  default: () => <p>ATTESTATION</p>,
}));
jest.mock('../../../components/onboarding/Mint', () => ({
  __esModule: true,
  default: () => <p>MINT</p>,
}));
jest.mock('../../../components/onboarding/Confirmation', () => ({
  __esModule: true,
  default: () => <p>CONFIRMATION</p>,
}));

const initializeState = (settings:any) => {
  settings.set(onboardingState, {
    currentStep: 2,
  });

  settings.set(walletState, {
    isConnected: true,
    chainId: 137,
  });
};

describe('Onboarding component', () => {
  test('Correctly renders child components', async () => {
    render(
      <RecoilRoot>
        <Onboarding />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('NAVBAR')).toBeVisible();
      expect(screen.getByText('SIDEBAR')).toBeVisible();
      expect(screen.getByText('CONNECTWALLET')).toBeVisible();
      expect(screen.queryByText('ATTESTATION')).not.toBeInTheDocument();
      expect(screen.queryByText('MINT')).not.toBeInTheDocument();
      expect(screen.queryByText('CONFIRMATION')).not.toBeInTheDocument();
    });
  });

  test('Correctly renders when currentStep is not 1', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Onboarding />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('NAVBAR')).toBeVisible();
      expect(screen.getByText('SIDEBAR')).toBeVisible();
      expect(screen.queryByText('CONNECTWALLET')).not.toBeInTheDocument();
      expect(screen.getByText('ATTESTATION')).toBeVisible();
      expect(screen.queryByText('MINT')).not.toBeInTheDocument();
      expect(screen.queryByText('CONFIRMATION')).not.toBeInTheDocument();
    });
  });
});
