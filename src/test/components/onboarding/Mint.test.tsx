import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import userEvent from '@testing-library/user-event';
import Mint from '../../../components/onboarding/Mint';
import { onboardingState } from '../../../state/onboarding';
import config from '../../../config';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(),
}));

Object.defineProperty(window, 'fetch', {
  configurable: true,
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'Function', {
  configurable: true,
  writable: true,
  value: jest.fn(),
});

jest.mock('../../../components/shared/P5Sketch', () => ({
  __esModule: true,
  default: () => <p>SKETCH</p>,
  saveImage: jest.fn(),
}));

const initializeOnboardingState = (settings:any) => {
  settings.set(onboardingState, {
    zklMemberNft: {
      totalSupply: jest.fn(() => (10)),
      mint: jest.fn(() => ({
        txHash: 'mocktxhash',
        wait: jest.fn(),
      })),
      getAllTokensOwnedBy: jest.fn(() => ([
        { tokenId: 'mockZKLMemberToken' },
      ])),
    },
    mintVoucher: 'mockVoucher',
    attestationHash: 12345,
  });
};

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

const mockFetch = fetch as jest.Mocked<any>;
const mockFunction = Function as jest.Mocked<any>;
const mockIpfs = Ipfs as jest.Mocked<any>;

jest.setTimeout(7000);
describe('Mint Component Tests', () => {
  test('It renders', async () => {
    const onboardingStateObserver = jest.fn();
    mockFetch.mockResolvedValue({ text: jest.fn() });
    mockFunction.mockReturnValue(() => ({ sketch: 'mockSketch' }));

    render(
      <RecoilRoot>
        <RecoilObserver node={onboardingState} onChange={onboardingStateObserver} />
        <Mint />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('PREVIEW AND MINT YOUR MEMBER NFT')).toBeVisible();
      expect(screen.getByText('SKETCH')).toBeVisible();
    }, { timeout: 10000 });
  });

  test('Use different image workflow', async () => {
    const onboardingStateObserver = jest.fn();
    mockFetch.mockResolvedValue({ text: jest.fn() });
    mockFunction.mockReturnValue(() => ({ sketch: 'mockSketch' }));

    render(
      <RecoilRoot>
        <RecoilObserver node={onboardingState} onChange={onboardingStateObserver} />
        <Mint />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('PREVIEW AND MINT YOUR MEMBER NFT')).toBeVisible();
      expect(screen.getByText('SKETCH')).toBeVisible();
    }, { timeout: 10000 });

    await userEvent.click(screen.getByText('USE A DIFFERENT IMAGE'));

    await waitFor(() => {
      expect(onboardingStateObserver).toHaveBeenCalledWith({
        p5Sketch: {
          sketch: 'mockSketch',
        },
        currentStep: 2,
        attestationHash: 0,
      });
    });
  });

  test('Mint workflow', async () => {
    const onboardingStateObserver = jest.fn();
    mockFetch.mockResolvedValue({ text: jest.fn() });
    mockFunction.mockReturnValue(() => ({ sketch: 'mockSketch' }));

    render(
      <RecoilRoot initializeState={initializeOnboardingState}>
        <RecoilObserver node={onboardingState} onChange={onboardingStateObserver} />
        <Mint />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('PREVIEW AND MINT YOUR MEMBER NFT')).toBeVisible();
      expect(screen.getByText('SKETCH')).toBeVisible();
    }, { timeout: 10000 });

    await userEvent.click(screen.getByText('MINT YOUR NFT'));

    mockIpfs.prototype.addFiles = jest.fn(() => ([
      { Hash: 'qm123456789' },
    ]));

    await waitFor(() => {
      expect(onboardingStateObserver).toHaveBeenCalledWith(
        expect.objectContaining({
          attestationHash: 12345,
          currentStep: 4,
          mintConfirmation: {
            contractAddress: config.zkl.memberNft,
            membership: 'ZKLadder Member',
            tokenId: 'mockZKLMemberToken',
            txHash: 'mocktxhash',
            userAddress: undefined,
          },
          mintVoucher: 'mockVoucher',
        }),
      );
    }, { timeout: 6000 });
  });
});
