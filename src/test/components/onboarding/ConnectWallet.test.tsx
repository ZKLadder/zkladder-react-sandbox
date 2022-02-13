import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { MemberNft } from '@zkladder/zkladder-sdk-ts';
import userEvent from '@testing-library/user-event';
import { connect, apiSession } from '../../../utils/walletConnect';
import ConnectWallet from '../../../components/onboarding/ConnectWallet';
import { walletState } from '../../../state/wallet';
import { onboardingState } from '../../../state/onboarding';
import { getVoucher } from '../../../utils/api';

const existingMemberMessage = 'It appears you have connected with a wallet which already has member access. You may want to switch your address from within your crypto wallet before minting - or navigate to the member dashboard';

jest.mock('../../../utils/walletConnect', () => ({
  connect: jest.fn(),
  apiSession: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('../../../utils/api', () => ({
  getVoucher: jest.fn(),
}));

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  MemberNft: {
    setup: jest.fn(),
  },
}));

jest.mock('../../../config', () => ({
  zkl: {
    memberNft: '0x12345678',
  },
  ipfs: {
    projectId: 'mockid',
    projectSecret: 'mockSecret',
  },
}));

const initializeConnectedState = (settings:any) => {
  settings.set(walletState, {
    isConnected: true,
    isMember: false,
    provider: 'mockProvider',
    chainId: 'mockChainId',
    address: ['0xuser'],
  });
};

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

const mockConnect = connect as jest.Mocked<any>;
const mockApiSession = apiSession as jest.Mocked<any>;
const mockGetVoucher = getVoucher as jest.Mocked<any>;
const mockMemberNft = MemberNft as jest.Mocked<any>;

describe('Onboarding ConnectWallet component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot>
        <ConnectWallet />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('CONNECT YOUR WALLET')).toBeVisible();
      expect(screen.getByText('Connect Your Wallet')).toBeVisible();
    });
  });

  const mockInstance = { mock: 'instance' };
  const mockVoucher = { mock: 'voucher' };

  test('It correctly pushes to step 2 when user is already connected', async () => {
    const onboardingStateObserver = jest.fn();

    mockMemberNft.setup.mockResolvedValueOnce(mockInstance);
    mockGetVoucher.mockResolvedValueOnce(mockVoucher);

    render(
      <RecoilRoot initializeState={initializeConnectedState}>
        <RecoilObserver node={onboardingState} onChange={onboardingStateObserver} />
        <ConnectWallet />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('CONNECT YOUR WALLET')).toBeVisible();
      expect(screen.getByText('Connect Your Wallet')).toBeVisible();

      expect(mockMemberNft.setup).toHaveBeenCalledWith({
        provider: 'mockProvider',
        address: '0x12345678',
        infuraIpfsProjectId: 'mockid',
        infuraIpfsProjectSecret: 'mockSecret',
      });

      expect(mockGetVoucher).toHaveBeenCalledWith({
        userAddress: '0xuser',
        contractAddress: '0x12345678',
        chainId: 'mockChainId',
      });

      expect(onboardingStateObserver).toHaveBeenCalledWith({
        zklMemberNft: mockInstance,
        mintVoucher: mockVoucher,
        currentStep: 2,
      });
    });
  });

  test('Click to connect workflow', async () => {
    const onboardingStateObserver = jest.fn();
    const walletStateObserver = jest.fn();

    mockConnect.mockResolvedValueOnce({
      provider: 'mockProvider',
      address: ['0xuser'],
      chainId: 'mockChainId',
    });

    mockMemberNft.setup.mockResolvedValueOnce(mockInstance);
    mockGetVoucher.mockResolvedValueOnce(mockVoucher);
    mockApiSession.mockRejectedValueOnce(new Error('Your Eth account does not have access'));

    render(
      <RecoilRoot>
        <RecoilObserver node={onboardingState} onChange={onboardingStateObserver} />
        <RecoilObserver node={walletState} onChange={walletStateObserver} />
        <ConnectWallet />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('connectButton'));

    await waitFor(() => {
      expect(mockMemberNft.setup).toHaveBeenCalledWith({
        provider: 'mockProvider',
        address: '0x12345678',
        infuraIpfsProjectId: 'mockid',
        infuraIpfsProjectSecret: 'mockSecret',
      });

      expect(mockGetVoucher).toHaveBeenCalledWith({
        userAddress: '0xuser',
        contractAddress: '0x12345678',
        chainId: 'mockChainId',
      });

      expect(walletStateObserver).toHaveBeenCalledWith({
        provider: 'mockProvider',
        address: ['0xuser'],
        chainId: 'mockChainId',
        isConnected: true,
        isMember: false,
      });

      expect(onboardingStateObserver).toHaveBeenCalledWith({
        zklMemberNft: mockInstance,
        mintVoucher: mockVoucher,
        currentStep: 2,
      });
    });
  });

  test('Already a member error', async () => {
    const onboardingStateObserver = jest.fn();
    const walletStateObserver = jest.fn();

    mockConnect.mockResolvedValueOnce({
      provider: 'mockProvider',
      address: ['0xuser'],
      chainId: 'mockChainId',
    });

    mockMemberNft.setup.mockResolvedValueOnce(mockInstance);
    mockGetVoucher.mockResolvedValueOnce(mockVoucher);
    mockApiSession.mockResolvedValueOnce({ session: true });

    render(
      <RecoilRoot>
        <RecoilObserver node={onboardingState} onChange={onboardingStateObserver} />
        <RecoilObserver node={walletState} onChange={walletStateObserver} />
        <ConnectWallet />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('connectButton'));

    await waitFor(() => {
      expect(mockMemberNft.setup).toHaveBeenCalledWith({
        provider: 'mockProvider',
        address: '0x12345678',
        infuraIpfsProjectId: 'mockid',
        infuraIpfsProjectSecret: 'mockSecret',
      });

      expect(mockGetVoucher).toHaveBeenCalledWith({
        userAddress: '0xuser',
        contractAddress: '0x12345678',
        chainId: 'mockChainId',
      });

      expect(screen.getByText(existingMemberMessage)).toBeVisible();
    });
  });
});
