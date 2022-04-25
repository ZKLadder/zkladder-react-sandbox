import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Container, Button } from 'react-bootstrap';
import { QrCode } from 'react-bootstrap-icons';
import { MemberNft } from '@zkladder/zkladder-sdk-ts';
import style from '../../styles/onboarding.module.css';
import { walletState } from '../../state/wallet';
import {
  connect, apiSession, disconnect, switchChain,
} from '../../utils/walletConnect';
import { onboardingState } from '../../state/onboarding';
import { getVoucher } from '../../utils/api';
import config from '../../config';
import ErrorComponent from '../shared/Error';
import Loading from '../shared/Loading';

const existingMemberMessage = `It appears you have connected with a wallet which already has member access. 
Please connect to the member dashboard using the button in the top right`;

const incorrectChainMessage = 'Please ensure you are connected to the Polygon chain and retry the wallet connection';

function ConnectWallet() {
  const [wallet, setWalletState] = useRecoilState(walletState);
  const [error, setError] = useState() as any;
  const [loading, setLoading] = useState() as any;
  const [onboarding, setOnboardingState] = useRecoilState(onboardingState);

  // Check if user accessing page is already connected
  useEffect(() => {
    async function checkConnection() {
      try {
        if (wallet.isConnected && !wallet.isMember) {
          setLoading('Looks like you are already connected. Please wait one second while we check your wallet...');

          // Check for voucher - throws if one does not exist
          const mintVoucher = await getVoucher({
            userAddress: wallet?.address?.[0] as string,
            contractAddress: config.zkl.memberNft,
            chainId: parseInt(config.zkl.memberNftChainId, 10),
            roleId: 'Member',
          });

          // User is connected with the wrong chain
          if (wallet.isConnected && wallet.chainId?.toString() !== config.zkl.memberNftChainId) {
            throw new Error(incorrectChainMessage);
          }

          const zklMemberNft = await MemberNft.setup({
            provider: wallet?.provider,
            address: config.zkl.memberNft,
            infuraIpfsProjectId: config.ipfs.projectId,
            infuraIpfsProjectSecret: config.ipfs.projectSecret,
          });

          setLoading(false);

          setOnboardingState({
            ...onboarding,
            zklMemberNft,
            mintVoucher,
            currentStep: 2,
          });
        }
        // Connected user is already a member
        if (wallet.isConnected && wallet.isMember) {
          setLoading(false);
          setError(existingMemberMessage);
        }
      } catch (err:any) {
        setLoading(false);
        setError(err.message);
      }
    }

    checkConnection();
  }, []);

  async function tryConnect() {
    let providerDetails;
    let zklMemberNft: MemberNft;
    let mintVoucher;

    try {
      setLoading('Connecting wallet...');
      providerDetails = await connect();

      setLoading('Awaiting signature...');
      // Attempt to create an API session
      await apiSession(
        providerDetails?.provider,
        providerDetails?.address as string[],
      );
      // If the session is created successfully, the user is already a member and should not be minting
      setLoading(false);
      setError(existingMemberMessage);
    } catch (err:any) {
      // If session creation fails because of no access, the user can continue as they are not already a member
      if (err?.message === 'Your Eth account does not have access') {
        setLoading('Checking whitelist...');
        try {
          setWalletState({ ...providerDetails, isConnected: true, isMember: false });

          // Attempt to get voucher from ZKL API
          mintVoucher = await getVoucher({
            userAddress: providerDetails?.address[0] as string,
            contractAddress: config.zkl.memberNft,
            chainId: parseInt(config.zkl.memberNftChainId, 10),
            roleId: 'Member',
          });

          // Attempt to instantiate instance of MemberNft
          zklMemberNft = await MemberNft.setup({
            provider: providerDetails?.provider,
            address: config.zkl.memberNft,
            infuraIpfsProjectId: config.ipfs.projectId,
            infuraIpfsProjectSecret: config.ipfs.projectSecret,
          });

          if (providerDetails?.chainId.toString() !== config.zkl.memberNftChainId) {
            throw new Error(incorrectChainMessage);
          }

          setOnboardingState({
            ...onboarding,
            zklMemberNft,
            mintVoucher,
            currentStep: 2,
          });
        } catch (nestedErr:any) {
          setLoading(false);
          setError(nestedErr.message);
          if (providerDetails && nestedErr.message !== incorrectChainMessage) {
            setWalletState({ ...providerDetails, isConnected: true, isMember: false });
          }
        }
      } else { // If any other error is thrown then it is a legitimate error
        setLoading(false);
        setError(err.message);
        await disconnect();
      }
    }
  }

  return (
    <Container style={{ paddingLeft: '25px', paddingTop: '60px' }}>
      {/* Title */}
      <p className={style.title}>
        CONNECT YOUR WALLET
      </p>

      {/* Description */}
      <p className={style.description}>
        Using the wallet with the ETH address listed below,
        connect using your Metamask, Coinbase Wallet or any Wallet Connect compatible.
      </p>

      {/* Connect button */}
      <Button
        data-testid="connectButton"
        className={wallet.isConnected ? style['connect-button-inactive'] : style['connect-button']}
        disabled={wallet.isConnected}
        onClick={async () => {
          setError(false);
          tryConnect();
        }}
      >
        <QrCode size={36} style={{ marginRight: '8px' }} />
        Connect Your Wallet
      </Button>

      {/* Secondary Description */}
      <p className={style.description}>
        After selecting your wallet, you will be asked to sign a signature request to connect to ZK Ladder
        and the Ethereum blockchain. This will allow you to mint the ZK Ladder member token and give you access to the network.
      </p>

      {/* Error Indicator */}
      {error ? (<ErrorComponent text={error} />) : null}

      {/* Switch chain button */}
      {error === incorrectChainMessage
        ? (
          <Button
            className={style['active-button']}
            style={{ fontWeight: 'normal' }}
            onClick={async () => {
              try {
                setLoading('Switching chain');
                setError(false);
                const success = await switchChain('137');
                if (success) {
                  const providerDetails = await connect(false);

                  const zklMemberNft = await MemberNft.setup({
                    provider: providerDetails?.provider,
                    address: config.zkl.memberNft,
                    infuraIpfsProjectId: config.ipfs.projectId,
                    infuraIpfsProjectSecret: config.ipfs.projectSecret,
                  });

                  const mintVoucher = await getVoucher({
                    userAddress: wallet?.address?.[0] as string,
                    contractAddress: config.zkl.memberNft,
                    chainId: parseInt(config.zkl.memberNftChainId, 10),
                    roleId: 'Member',
                  });

                  setOnboardingState({
                    ...onboarding,
                    zklMemberNft,
                    mintVoucher,
                    currentStep: 2,
                  });
                }
              } catch (err:any) {
                setLoading(false);
                setError('Unable to switch chain. Please do so manually from your wallet interface');
              }
            }}
          >
            Switch to Polygon
          </Button>
        )
        : null}

      {/* Loading Indicator */}
      {loading ? (<Loading text={loading} />) : null}

    </Container>
  );
}

export default ConnectWallet;
