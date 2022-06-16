/* eslint-disable no-promise-executor-return */
import React, {
  useEffect, useState,
} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  Container, Button, Row, Col, ProgressBar,
} from 'react-bootstrap';
import { Ipfs, MemberNft } from '@zkladder/zkladder-sdk-ts';
import style from '../../styles/onboarding.module.css';
import sharedStyle from '../../styles/shared.module.css';
import P5Sketch, { saveImage } from '../shared/P5Sketch';
import { onboardingState } from '../../state/onboarding';
import { walletState } from '../../state/wallet';
import ErrorComponent from '../shared/Error';
import config from '../../config';
import networks from '../../constants/networks';
import { loadingState } from '../../state/page';

/**
 * Implements a blockchain query with support for several retries due to slowness in propagation of newly minted assets on polygon
 * @returns array of tokens owned by userAddress param
 */
const fetchTokensWithRetry = async (nftInstance:MemberNft, currentAttempt:number, userAddress:string) => {
  const maxAttempts = 10;

  let tokens = await nftInstance.getAllTokensOwnedBy(userAddress);

  if (tokens.length < 1 && currentAttempt <= maxAttempts) {
    // Repeat query with gradual back off
    await new Promise((resolve) => setTimeout(resolve, currentAttempt * 1000));
    tokens = await fetchTokensWithRetry(nftInstance, currentAttempt + 1, userAddress);
    return tokens;
  } if (tokens.length < 1 && currentAttempt > maxAttempts) {
    // Once maxAttempts reached, display useful error message
    throw new Error('We are having difficulty retrieving your newly minted token from the Polygon network. Please wait a few seconds and refresh your page');
  } else return tokens;
};

const castNetworks = networks as any;

function Mint() {
  const [error, setError] = useState() as any;
  const [loading, setLoading] = useRecoilState(loadingState);
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
    <Container className={sharedStyle['body-wrapper']}>
      {/* Title */}
      <p className={style.title}>
        PREVIEW AND MINT YOUR MEMBER NFT
      </p>

      {/* Description */}
      <p className={style.description}>
        We are using code to generate NFT artwork based off of your seed upload.
        This will be the “cover art” of your member token and profile.
      </p>

      {/* P5 Canvas || Progress Bar */}
      <div className={style['upload-wrapper']}>
        {onboarding.p5Sketch && progress === 100
          ? (
            <P5Sketch
              className={style.p5Sketch}
              config={{ tokenSeed: onboarding.tokenSeed }}
              sketch={onboarding.p5Sketch.sketch as any}
            />
          )
          : (
            <div style={{ marginTop: '33%', marginBottom: '25%' }}>
              <p
                className={`${style.description} align-items-center`}
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
            className={style['active-button']}
            onClick={async () => {
              setLoading({ loading: false });
              setError(false);
              try {
                const { zklMemberNft, mintVoucher, tokenSeed } = onboarding;
                const ipfsInstance = new Ipfs(config.ipfs.projectId, config.ipfs.projectSecret);
                const supply = await zklMemberNft.totalSupply();
                const image = await saveImage(supply.toString(), 350, 325) as File;
                const cids = await ipfsInstance.addFiles([{ file: image, fileName: supply.toString() }]);
                const imageCid = cids[0].Hash;

                setLoading({ loading: true, header: 'Member Onboarding', content: 'Awaiting wallet approval...' });

                const unMinedTx = await zklMemberNft.mint(
                  mintVoucher.signedVoucher,
                  {
                    description: 'This NFT functions as your badge of membership into ZKLadder, a community of builders working to bring the next generation of web3 projects to life.',
                    image: `ipfs://${imageCid}`,
                    template: 'MemberNft',
                    artStyle: 'generative',
                    generativeLibrary: 'p5',
                    roleId: 'Member',
                    tokenSeed,
                    attributes: [
                      { trait_type: 'Role', value: 'Member' },
                      { trait_type: 'Token Seed', value: tokenSeed, display_type: 'number' },
                    ],
                  },
                );

                setLoading({
                  loading: true,
                  header: 'Your NFT is being mined',
                  content: (
                    <div>
                      You can hang around and wait - or come back in a few minutes to log in.
                      Your Tx Hash is
                      {' '}
                      <a target="_blank" className={style.description} href={`${castNetworks[chainId as number]?.blockExplorer}${unMinedTx.txHash}`} rel="noreferrer">{unMinedTx.txHash}</a>

                    </div>
                  ),
                });

                await unMinedTx.wait();

                const tokens = await fetchTokensWithRetry(zklMemberNft, 1, mintVoucher.userAddress);
                const { tokenId } = tokens[tokens.length - 1];

                setLoading({ loading: false });

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
                setLoading({ loading: false });
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
            className={style['transparent-button']}
            onClick={async () => {
              setOnboardingState({
                ...onboarding,
                currentStep: 2,
                tokenSeed: 0,
              });
            }}
          >
            USE A DIFFERENT IMAGE

          </Button>
        </Col>

        {/* Secondary Description || Loading Indicator */}
        <Col style={{ display: 'block' }}>
          {loading.loading
            ? null
            : (
              <p className={style.description}>
                After electing to mint, you will be prompted to approve the transaction.
                Once minted, the NFT will be in your wallet and you will be able to view it in your profile on app.zkladder.com
              </p>
            )}

        </Col>
      </Row>

      {/* Error Indicator */}
      {error ? (<ErrorComponent text={error} />) : null}

    </Container>
  );
}

export default Mint;
