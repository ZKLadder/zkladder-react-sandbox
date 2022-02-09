import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import Confirmation from '../../../components/onboarding/Confirmation';
import { onboardingState } from '../../../state/onboarding';

jest.mock('../../../components/shared/P5Sketch', () => ({
  __esModule: true,
  default: () => <p>SKETCH</p>,
  saveImage: jest.fn(),
}));

const initializeOnboardingState = (settings:any) => {
  settings.set(onboardingState, {
    p5Sketch: { sketch: 'mockSketch' },
    mintConfirmation: {
      userAddress: '0xuser',
      membership: 'mockMembership',
      tokenId: 'mockId',
      contractAddress: '0xcontract',
      txHash: '0x12345678',
    },
  });
};

describe('Confirmation component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeOnboardingState}>
        <Confirmation />
      </RecoilRoot>,
    );
    await waitFor(() => {
      expect(screen.getByText('CONFIRMATION: WELCOME TO ZK LADDER!')).toBeVisible();
      expect(screen.getByText('MEMBER ADDRESS:')).toBeVisible();
      expect(screen.getByText('0xuser')).toBeVisible();
      expect(screen.getByText('MEMBERSHIP TIER:')).toBeVisible();
      expect(screen.getByText('mockMembership')).toBeVisible();
      expect(screen.getByText('TOKEN ID:')).toBeVisible();
      expect(screen.getByText('mockId')).toBeVisible();
      expect(screen.getByText('ZKL NFT CONTRACT ADDRESS:')).toBeVisible();
      expect(screen.getByText('0xcontract')).toBeVisible();
      expect(screen.getByText('TX HASH:')).toBeVisible();
      expect(screen.getByText('0x12345678')).toBeVisible();
    });
  });
});
