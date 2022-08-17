/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilState,
  useRecoilRefresher_UNSTABLE as useRecoilRefresherUnstable,
  useSetRecoilState,
} from 'recoil';
import {
  ListGroup, Container, Navbar, Spinner, Row, Col, Collapse,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import { CloudUpload, ExclamationTriangle } from 'react-bootstrap-icons';
import style from '../../../styles/manageProjects.module.css';
import { contractsWithMetadataState, writableContractState, selectedContractState } from '../../../state/contract';
import { loadingState, manageProjectsPageState } from '../../../state/page';
import { walletState } from '../../../state/wallet';
import { nftContractUpdates } from '../../../state/nftContract';
import networks from '../../../constants/networks';
import { switchChain } from '../../../utils/walletConnect';
import Collection from '../Collection';
import config from '../../../config';
import Settings from './Settings';
import Tiers from './Tiers';
import Drops from './Drops';
import Admins from '../Admins';

function ProjectBody({ isUnitTest }:{isUnitTest:boolean}) {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address } = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string];
  const [changes, setChanges] = useRecoilState(nftContractUpdates);
  const { chainId } = useRecoilValue(walletState);
  const memberNft = useRecoilValueLoadable(writableContractState)?.contents;
  const refresh = useRecoilRefresherUnstable(contractsWithMetadataState);
  const setTransactionLoading = useSetRecoilState(loadingState);
  const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectSecret);

  const [currentSection, setCurrentSection] = useRecoilState(manageProjectsPageState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showWarning = (contractData && chainId?.toString() !== contractData.chainId);

  // Returns true if the user has made changes to any of the contracts configurable fields
  const isChangePending = () => {
    let changesPending = false;

    if (changes.image
    || (changes.description && changes.description !== contractData?.description)
    || (changes.external_link && changes.external_link !== contractData?.external_link)) changesPending = true;

    if (changes.beneficiaryAddress
      && changes.beneficiaryAddress !== contractData?.beneficiaryAddress) changesPending = true;

    if (changes.tiers && JSON.stringify(changes.tiers) !== JSON.stringify(contractData?.tiers)) changesPending = true;

    return changesPending;
  };

  // Steps through each possible contract change and creates transactions for them in sequence
  const initiateUpdates = async () => {
    try {
      // If the image has changed, upload the new image to IPFS
      let imageHash;
      if (changes.image) {
        const cids = await ipfs.addFiles([{ file: changes.image, fileName: changes.image.name }]);
        imageHash = `ipfs://${cids[0].Hash}`;
      }

      // Create transaction for contract metadata (image, description, external_link)
      if (changes.image
        || (changes.description && changes.description !== contractData?.description)
        || (changes.external_link && changes.external_link !== contractData?.external_link)) {
        const newCollectionMetadata = {
          name: contractData?.name,
          symbol: contractData?.symbol,
          image: imageHash || contractData?.image,
          description: changes.description || contractData?.description,
          external_link: changes.external_link || contractData?.external_link,
        };

        const file = new Blob([JSON.stringify(newCollectionMetadata)], { type: 'application/json' });
        const response = await ipfs.addFiles([{ file, fileName: `${contractData?.symbol}.json` }]);
        const contractUri = `ipfs://${response[0].Hash}`;

        setTransactionLoading({
          loading: true,
          header: 'Creating a transaction to update collection metadata',
          content: 'Awaiting user signature',
        });

        const tx = await memberNft?.setContractUri(contractUri);

        setTransactionLoading({
          loading: true,
          header: 'Creating a transaction to update collection metadata',
          content: 'Transaction is being mined',
        });

        await tx?.wait();
      }

      // Create transaction for beneficiaryAddress
      if (changes.beneficiaryAddress
      && changes.beneficiaryAddress !== contractData?.beneficiaryAddress) {
        setTransactionLoading({
          loading: true,
          header: `Creating a transaction to set the beneficiary address to ${changes.beneficiaryAddress}`,
          content: 'Awaiting user signature',
        });

        const tx = await memberNft?.setBeneficiary(changes.beneficiaryAddress);

        setTransactionLoading({
          loading: true,
          header: `Creating a transaction to set the beneficiary address to ${changes.beneficiaryAddress}`,
          content: 'Transaction is being mined',
        });

        await tx?.wait();
      }

      // Transactions for tier updates
      if (changes.tiers && JSON.stringify(changes.tiers) !== JSON.stringify(contractData.tiers)) {
        // Create transaction to add new tiers
        if (changes.tiers.length > contractData.tiers.length) {
          const additions = changes.tiers
            .slice(contractData.tiers.length, changes.tiers.length)
            .map(({
              name, description, image, royaltyBasis, isTransferable, salePrice,
            }) => ({
              name,
              description,
              image,
              royaltyBasis,
              isTransferable,
              salePrice,
            }));

          setTransactionLoading({
            loading: true,
            header: `Creating a transaction to add ${additions.length} new tiers`,
            content: 'Awaiting user signature',
          });

          /* eslint-disable no-restricted-syntax, no-await-in-loop */
          // If new images have been added, upload them to IPFS
          for (const addition of additions) {
            if (addition.image) {
              const cids = await ipfs.addFiles([{ file: addition.image as Blob, fileName: (addition.image as any)?.name }]);
              addition.image = `ipfs://${cids[0].Hash}`;
            }
          }

          const tx = await memberNft?.addTiers(additions);

          setTransactionLoading({
            loading: true,
            header: `Creating a transaction to add ${additions.length} new tiers`,
            content: 'Transaction is being mined',
          });

          await tx?.wait();
        }

        // Create transaction to update existing tiers
        const updates = changes.tiers
          .slice(0, contractData.tiers.length)
          .filter((potentialUpdate, index) => JSON.stringify(potentialUpdate) !== JSON.stringify(contractData.tiers?.[index]))
          .map(({
            tierId, name, description, image, royaltyBasis, isTransferable, salePrice,
          }) => ({
            tierId,
            tierUpdates: {
              name,
              description,
              image,
              royaltyBasis,
              isTransferable,
              salePrice,
            },
          }));

        if (updates.length > 0) {
          setTransactionLoading({
            loading: true,
            header: `Creating a transaction to update ${updates.length} existing tiers`,
            content: 'Awaiting user signature',
          });

          // If new images have been added, upload them to IPFS
          for (const { tierUpdates } of updates) {
            if (typeof tierUpdates.image !== 'string' && tierUpdates.image) {
              const cids = await ipfs.addFiles([{ file: tierUpdates.image as Blob, fileName: (tierUpdates.image as any)?.name }]);
              tierUpdates.image = `ipfs://${cids[0].Hash}`;
            }
          }

          const tx = await memberNft?.updateTiers(updates);

          setTransactionLoading({
            loading: true,
            header: `Creating a transaction to update ${updates.length} existing tiers`,
            content: 'Transaction is being mined',
          });

          await tx?.wait();
        }
      }

      // Refresh contract data to capture all changes
      refresh();
      setTransactionLoading({ loading: false });
    } catch (err:any) {
      // If error occured anywhere above, set error text and refresh data
      setError(err.message || 'There was an error commiting your changes to the blockchain. Resetting to latest blockchain state.');
      refresh();
      setTransactionLoading({ loading: false });
    }
  };

  // Use effect to reset changes anytime contractData changes
  useEffect(() => {
    if (!isUnitTest) {
      setChanges({
        tiers: contractData?.tiers,
      });
    }
  }, [contractData]);

  return (
    <Container className={style['body-wrapper']}>
      {/* Title */}
      <p className={style.title} style={{ color: '#16444C', lineHeight: '30px' }}>
        MANAGE PROJECT
        <Link style={{ float: 'right', fontSize: '14px', color: '#4EB9B1' }} to="/projects">
          <span>VIEW ALL PROJECTS</span>
        </Link>
      </p>

      {/* Description */}
      <p className={style.description} style={{ color: '#16444C', lineHeight: '20px' }}>
        Select a section below to view and edit the details of your smart contract
      </p>

      {/* Switch chain notice if user is connected to wrong chain */}
      { showWarning
        ? (
          <span style={{ color: '#DB0056', fontWeight: 'bold' }}>
            <hr />
            <ExclamationTriangle size={20} style={{ margin: '0px 5px 4px 5px' }} />
            {`You must connect your wallet to ${(networks as any)[contractData.chainId].label} to manage this project`}

            {loading ? <Spinner size="sm" className={style['switch-chain-notice']} style={{ margin: '2px 10px 0px 0px' }} animation="border" /> : (
              <span
                role="button"
                tabIndex={0}
                className={style['switch-chain-notice']}
                onClick={async () => {
                  try {
                    setLoading(true);
                    await switchChain(contractData.chainId);
                    setLoading(false);
                  } catch (err:any) {
                    setLoading(false);
                  }
                }}
              >
                SWITCH CHAIN
              </span>
            )}
            <hr />
          </span>
        ) : null}

      {/* Changes pending notice if user has made updates */}
      <Collapse in={!showWarning && isChangePending()}>
        <Row style={{ color: '#4EB9B1', fontWeight: 'bold' }}>
          <Col style={{ margin: '0px' }} lg={12}><hr style={{ marginTop: '0px' }} /></Col>
          <Col lg={7}>
            <CloudUpload size={24} style={{ margin: '0px 5px 2px 5px' }} />
            You have changes pending for this contract
          </Col>
          <Col className="mr-auto" lg={{ offset: 1, span: 2 }}>
            <span
              role="button"
              tabIndex={0}
              style={{ fontSize: '12px', margin: '3px 0px 0px 0px' }}
              className={style['switch-chain-notice']}
              onClick={initiateUpdates}
            >

              SAVE CHANGES
            </span>
          </Col>
          <Col>
            <span
              role="button"
              tabIndex={0}
              style={{ fontSize: '12px', margin: '3px 0px 0px 0px' }}
              className={style['switch-chain-notice']}
              onClick={() => {
                setError('');
                setChanges({ tiers: contractData.tiers });
              }}
            >
              RESET CHANGES
            </span>

          </Col>

          <Col lg={12}><hr /></Col>
        </Row>
      </Collapse>

      {/* Error notice if an error occured during transaction workflow */}
      {error && !showWarning && !isChangePending()
        ? (
          <span style={{ color: '#DB0056', fontWeight: 'bold' }}>
            <hr />
            <ExclamationTriangle size={20} style={{ margin: '0px 5px 4px 5px' }} />
            {error}
            <hr />
          </span>
        ) : null}

      {/* Navigation */}
      <Navbar style={{ paddingLeft: '0px' }} expand="lg">
        <Navbar.Toggle style={{
          position: 'absolute', right: '5%', top: '5%', zIndex: '1',
        }}
        />
        <Navbar.Collapse>
          <ListGroup horizontal="lg">

            <ListGroup.Item
              className={currentSection === 'collection' ? style['contract-body-nav-active'] : style['contract-body-nav']}
              onClick={() => { setCurrentSection('collection'); }}
            >
              COLLECTION
            </ListGroup.Item>

            <ListGroup.Item
              className={currentSection === 'settings' ? style['contract-body-nav-active'] : style['contract-body-nav']}
              onClick={() => { setCurrentSection('settings'); }}
            >
              SETTINGS
            </ListGroup.Item>

            <ListGroup.Item
              className={currentSection === 'tiers' ? style['contract-body-nav-active'] : style['contract-body-nav']}
              onClick={() => { setCurrentSection('tiers'); }}
            >
              TIERS
            </ListGroup.Item>

            <ListGroup.Item
              className={currentSection === 'drops' ? style['contract-body-nav-active'] : style['contract-body-nav']}
              onClick={() => { setCurrentSection('drops'); }}
            >
              DROPS
            </ListGroup.Item>

            <ListGroup.Item
              className={currentSection === 'admins' ? style['contract-body-nav-active'] : style['contract-body-nav']}
              onClick={() => { setCurrentSection('admins'); }}
            >
              ADMINS
            </ListGroup.Item>
          </ListGroup>
        </Navbar.Collapse>
      </Navbar>

      {/* Render section depending on currentSection state variable */}
      {currentSection === 'collection' ? <Collection /> : null}
      {currentSection === 'settings' ? <Settings /> : null}
      {currentSection === 'tiers' ? <Tiers /> : null}
      {currentSection === 'drops' ? <Drops /> : null}
      {currentSection === 'admins' ? <Admins /> : null}
    </Container>
  );
}

export default ProjectBody;
