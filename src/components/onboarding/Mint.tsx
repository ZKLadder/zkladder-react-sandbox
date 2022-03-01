/* eslint-disable no-promise-executor-return */
import React, {
  useEffect, useState,
} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  Container, Button, Row, Col, ProgressBar,
} from 'react-bootstrap';
import '../../styles/onboarding.css';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import P5Sketch, { saveImage } from '../shared/P5Sketch';
import { onboardingState } from '../../state/onboarding';
import { walletState } from '../../state/wallet';
import Error from '../shared/Error';
import config from '../../config';
import Loading from '../shared/Loading';
import networks from '../../constants/networks';

const castNetworks = networks as any;

function Mint() {
  const [error, setError] = useState() as any;
  const [loading, setLoading] = useState() as any;
  const [onboarding, setOnboardingState] = useRecoilState(onboardingState);
  const { chainId } = useRecoilValue(walletState);
  const [progress, setProgress] = useState(0);

  // Generate P5 compatible sketch function from IPFS hosted generative script
  async function getZKAnimation() {
    const response = await fetch(config.zkl.memberSketchCid);
    const memberSketch = await response.text();
    /* eslint-disable no-new-func */
    const parsedMemberSketch = Function(memberSketch);
    setOnboardingState({
      ...onboarding,
      p5Sketch: parsedMemberSketch(),
    });
  }

  // Activate progress bar and fetch ZKL script when progress == 100
  useEffect(() => {
    if (progress !== 100) {
      setTimeout(() => {
        setProgress(progress + 5);
      }, 50);
    } else {
      getZKAnimation();
    }
  }, [progress]);

  return (
    <Container style={{ paddingLeft: '25px', paddingTop: '60px' }}>
      {/* Title */}
      <p className="title">
        PREVIEW AND MINT YOUR MEMBER NFT
      </p>

      {/* Description */}
      <p className="description">
        We are using code to generate NFT artwork based off of your attestation upload.
        This will be the “cover art” of your member token and profile.
      </p>

      {/* P5 Canvas || Progress Bar */}
      <div className="upload-wrapper">
        {onboarding.p5Sketch && progress === 100
          ? (
            <P5Sketch
              config={{ attestationHash: onboarding.attestationHash }}
              sketch={onboarding.p5Sketch.sketch as any}
            />
          )
          : (
            <div style={{ marginTop: '25%', marginBottom: '25%' }}>
              <p
                className="description align-items-center"
                style={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}
              >
                GENERATING...
              </p>
              <ProgressBar now={progress} />
            </div>
          )}
      </div>
      <Row>
        <Col lg={3}>
          {/* Mint Button */}
          <Button
            className="active-button"
            onClick={async () => {
              setLoading(false);
              setError(false);
              try {
                const { zklMemberNft, mintVoucher, attestationHash } = onboarding;
                const ipfsInstance = new Ipfs(config.ipfs.projectId, config.ipfs.projectSecret);
                const supply = await zklMemberNft.totalSupply();
                const image = await saveImage(supply.toString()) as File;
                const cids = await ipfsInstance.addFiles([{ file: image, fileName: supply.toString() }]);
                const imageCid = cids[0].Hash;

                const unMinedTx = await zklMemberNft.mint(
                  mintVoucher.signedVoucher,
                  {
                    name: `ZKLadder Member #${supply}`,
                    description: 'ZKLadder is an exclusive community of builders working to bring the next generation of web3 projects to life. The ZKL Member token grants one access to the community and all of its benefits.',
                    image: `ipfs://${imageCid}`,
                    tokenId: supply,
                    template: 'MemberNft',
                    art_style: 'generative',
                    generative_library: 'p5',
                    role: 'Member',
                    attestation_hash: attestationHash,
                    attributes: [
                      { trait_type: 'Role', value: 'Member' },
                      { trait_type: 'Attestation Hash', value: attestationHash, display_type: 'number' },
                    ],
                  },
                );

                setLoading(unMinedTx.txHash);

                await unMinedTx.wait();

                // Wait 5 seconds to ensure Infura nodes have updated server side
                await new Promise((resolve) => setTimeout(resolve, 5000));

                const tokens = await zklMemberNft.getAllTokensOwnedBy(mintVoucher.userAddress);
                const { tokenId } = tokens[tokens.length - 1];

                setOnboardingState({
                  ...onboarding,
                  currentStep: 4,
                  mintConfirmation: {
                    userAddress: mintVoucher.userAddress,
                    membership: 'ZKLadder Member',
                    tokenId,
                    contractAddress: config.zkl.memberNft,
                    txHash: unMinedTx.txHash,
                  },
                });
              } catch (err:any) {
                setLoading(false);
                setError(err.message || 'There was a problem minting your NFT - please reach out to our tech team');
              }
            }}
          >
            MINT YOUR NFT
          </Button>
        </Col>
        <Col lg={9}>
          {/* Use Different Image Button */}
          <Button
            className="transparent-button"
            onClick={async () => {
              setOnboardingState({
                ...onboarding,
                currentStep: 2,
                attestationHash: 0,
              });
            }}
          >
            USE A DIFFERENT IMAGE

          </Button>
        </Col>

        {/* Secondary Description || Loading Indicator */}
        <Col style={{ display: 'block' }}>
          {loading
            ? (
              <div>
                <Col lg={3}><Loading /></Col>
                <p className="title" style={{ fontSize: '22px', margin: '0px' }}>Your NFT is being mined.</p>
                <p className="description">
                  You can hang around and wait for a few minutes
                  - or monitor the transaction on your own and come back later to log in. Your Tx Hash is
                  {' '}
                  <a target="_blank" className="confirmation-link" href={`${castNetworks[chainId as number]?.blockExplorer}${loading}`} rel="noreferrer">{loading}</a>
                </p>
              </div>
            )
            : (
              <p className="description">
                After electing to mint, you will be prompted to approve the transaction.
                Once minted, the NFT will be in your wallet and you will be able to view it in your profile on app.zkladder.com
              </p>
            )}

        </Col>
      </Row>

      {/* Error Indicator */}
      {error ? (<Error text={error} />) : null}

    </Container>
  );
}

export default Mint;
