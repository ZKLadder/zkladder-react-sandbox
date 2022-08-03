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
import { loadingState } from '../../../state/page';
import { walletState } from '../../../state/wallet';
import { nftContractUpdates } from '../../../state/nftContract';
import networks from '../../../constants/networks';
import { switchChain } from '../../../utils/walletConnect';
import Collection from '../Collection';
import config from '../../../config';
import Settings from './Settings';
import Roles from './Roles';
import Whitelist from '../Whitelist';
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

  const [currentSection, setCurrentSection] = useState('collection');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showWarning = (contractData && chainId?.toString() !== contractData.chainId);

  // Returns true if the user has made changes to any of the contracts configurable fields
  const isChangePending = () => {
    let changesPending = false;

    if (JSON.stringify(changes?.roles) !== JSON.stringify(contractData?.roles)
    || changes.image
    || (changes.description && changes.description !== contractData?.description)) changesPending = true;

    if (changes.royaltyBasis?.toString()
      && changes.royaltyBasis !== contractData?.royaltyBasis) changesPending = true;

    if (changes.beneficiaryAddress
      && changes.beneficiaryAddress !== contractData?.beneficiaryAddress) changesPending = true;

    if (changes.isTransferable?.toString()
    && changes.isTransferable !== contractData?.isTransferable) changesPending = true;

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

      // If the roles have changed, perform validation to ensure no missing names or id's
      if (JSON.stringify(changes?.roles) !== JSON.stringify(contractData?.roles)) {
        changes?.roles?.forEach((role, index) => {
          if (!role.name) {
            setChanges({
              ...changes,
              errors: { roleIndex: index, roleError: `Role #${index + 1} is missing a name` },
            });
            setCurrentSection('roles');
          } else if (!role.id) {
            setChanges({
              ...changes,
              errors: { roleIndex: index, roleError: `Role #${index + 1} is missing an ID` },
            });
            setCurrentSection('roles');
          }
        });
      }

      // Create transaction for contract metadata (image, description, roles)
      if (JSON.stringify(changes?.roles) !== JSON.stringify(contractData?.roles)
    || changes.image
    || (changes.description && changes.description !== contractData?.description)) {
        const newCollectionMetadata = {
          name: contractData?.name,
          symbol: contractData?.symbol,
          beneficiaryAddress: changes.beneficiaryAddress || contractData?.beneficiaryAddress,
          image: imageHash || contractData?.image,
          description: changes.description || contractData?.description,
          script: contractData?.script,
          roles: changes.roles || contractData?.roles,
        };

        const file = new Blob([JSON.stringify(newCollectionMetadata)], { type: 'application/json' });
        const response = await ipfs.addFiles([{ file, fileName: `${contractData?.symbol}.json` }]);
        const contractUri = `ipfs://${response[0].Hash}`;

        setTransactionLoading({
          loading: true,
          header: 'Creating a transaction to update the collection\'s roles/metadata',
          content: 'Awaiting user signature',
        });

        const tx = await memberNft?.setContractUri(contractUri);

        setTransactionLoading({
          loading: true,
          header: 'Creating a transaction to update the collection\'s roles/metadata',
          content: 'Transaction is being mined',
        });

        await tx?.wait();
      }

      // Create transaction for royaltyBasis
      if (changes.royaltyBasis?.toString()
      && changes.royaltyBasis !== contractData?.royaltyBasis) {
        setTransactionLoading({
          loading: true,
          header: `Creating a transaction to set royalty to ${changes.royaltyBasis} basis points`,
          content: 'Awaiting user signature',
        });

        const tx = await memberNft?.setRoyalty(changes.royaltyBasis);

        setTransactionLoading({
          loading: true,
          header: `Creating a transaction to set royalty to ${changes.royaltyBasis} basis points`,
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

      // Create transaction for isTransferable
      if (changes.isTransferable?.toString()
    && changes.isTransferable !== contractData?.isTransferable) {
        setTransactionLoading({
          loading: true,
          header: `Creating a transaction to make this collection ${changes.isTransferable ? 'TRANSFERABLE' : 'NON-TRANSFERABLE'}`,
          content: 'Awaiting user signature',
        });

        const tx = await memberNft?.setIsTransferrable(changes.isTransferable);

        setTransactionLoading({
          loading: true,
          header: `Creating a transaction to make this collection ${changes.isTransferable ? 'TRANSFERABLE' : 'NON-TRANSFERABLE'}`,
          content: 'Transaction is being mined',
        });

        await tx?.wait();
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
        roles: contractData?.roles,
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
                setChanges({ roles: contractData.roles });
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
              className={currentSection === 'roles' ? style['contract-body-nav-active'] : style['contract-body-nav']}
              onClick={() => { setCurrentSection('roles'); }}
            >
              ROLES
            </ListGroup.Item>

            <ListGroup.Item
              className={currentSection === 'whitelist' ? style['contract-body-nav-active'] : style['contract-body-nav']}
              onClick={() => { setCurrentSection('whitelist'); }}
            >
              WHITELIST
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
      {currentSection === 'roles' ? <Roles /> : null}
      {currentSection === 'whitelist' ? <Whitelist /> : null}
      {currentSection === 'admins' ? <Admins /> : null}
    </Container>
  );
}

export default ProjectBody;
