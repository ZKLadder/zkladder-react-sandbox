import React, { useState } from 'react';
import {
  Row, Form, OverlayTrigger, Popover, Button, Col,
} from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';
import { useRecoilValue } from 'recoil';
import { MemberNft } from '@zkladder/zkladder-sdk-ts';
import nftStyles from '../../styles/nft';
import { walletState } from '../../state/wallet';
import FileUploadModal from '../ipfs/FileUploadModal';
import Error from '../shared/Error';
import Loading from '../shared/Loading';
import CopyToClipboard from '../shared/CopyToClipboard';

function Deploy() {
  const { address, provider } = useRecoilValue(walletState) as {address:string[], provider:any};
  const [deploymentConfig, setDeploymentConfig] = useState({
    name: '',
    symbol: '',
    baseUri: '',
    beneficiary: address[0],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const [contractAddress, setAddress] = useState() as any;
  const [loading, setLoading] = useState() as any;
  const [error, setError] = useState() as any;
  return (
    <div>
      <FileUploadModal show={modalOpen} onHide={() => setModalOpen(false)} />
      <Form.Group>
        <Form.Label> Member NFT Deployment </Form.Label>
        <hr />

        <Row style={nftStyles.deployRow}>
          <Form.Control
            value={deploymentConfig.name}
            type="text"
            style={nftStyles.deployField}
            placeholder="Enter a name for your Member NFT contract..."
            onChange={(event) => {
              setDeploymentConfig({ ...deploymentConfig, name: event.target.value });
            }}
          />
          <OverlayTrigger
            placement="right"
            overlay={(
              <Popover id="popover-basic">
                <Popover.Header as="h3">Collection Name</Popover.Header>
                <Popover.Body>
                  The name of your NFT collection
                </Popover.Body>
              </Popover>
      )}
          >
            <QuestionCircle style={nftStyles.tooltip} />
          </OverlayTrigger>
        </Row>

        <Row style={nftStyles.deployRow}>
          <Form.Control
            value={deploymentConfig.symbol}
            type="text"
            style={nftStyles.deployField}
            placeholder="Enter a symbol for your Member NFT contract..."
            onChange={(event) => {
              setDeploymentConfig({ ...deploymentConfig, symbol: event.target.value });
            }}
          />
          <OverlayTrigger
            placement="right"
            overlay={(
              <Popover id="popover-basic">
                <Popover.Header as="h3">Collection Symbol</Popover.Header>
                <Popover.Body>
                  {'The trading symbol of your NFT\'s should they ever list on a market place'}
                </Popover.Body>
              </Popover>
      )}
          >
            <QuestionCircle style={nftStyles.tooltip} />
          </OverlayTrigger>
        </Row>

        <Row style={nftStyles.deployRow}>
          <Form.Control
            value={deploymentConfig.baseUri}
            type="text"
            style={nftStyles.deployField}
            placeholder="Enter an image or other form of content URI..."
            onChange={(event) => {
              setDeploymentConfig({ ...deploymentConfig, baseUri: event.target.value });
            }}
          />
          <OverlayTrigger
            placement="right"
            overlay={(
              <Popover id="popover-basic">
                <Popover.Header as="h3">Base URI</Popover.Header>
                <Popover.Body>
                  {/* eslint-disable-next-line */}
                  The Base URI can point to any content that you wish to associate with the general collection, rather then a single NFT.
                </Popover.Body>
              </Popover>
      )}
          >
            <QuestionCircle style={nftStyles.tooltip} />
          </OverlayTrigger>
          <Button onClick={() => { setModalOpen(true); }} style={{ marginLeft: '20px' }}>
            Upload new file to IPFS
          </Button>
        </Row>

        <Row style={nftStyles.deployRow}>
          <Form.Control
            value={deploymentConfig.beneficiary}
            type="text"
            style={nftStyles.deployField}
            placeholder="Enter a beneficiary address..."
            onChange={(event) => {
              setDeploymentConfig({ ...deploymentConfig, beneficiary: event.target.value });
            }}
          />

          <OverlayTrigger
            placement="right"
            overlay={(
              <Popover id="popover-basic">
                <Popover.Header as="h3">Beneficiary Address</Popover.Header>
                <Popover.Body>
                  {'The beneficiary is the Ethereum Address that recieves proceeds from any mint (sale) of new NFT\'s'}
                </Popover.Body>
              </Popover>
      )}
          >
            <QuestionCircle style={nftStyles.tooltip} />
          </OverlayTrigger>
          <Col xs={12}>
            <Form.Text className="text-muted">
              We prefilled this with your current address for convenience
            </Form.Text>
          </Col>
        </Row>

        <Button
          data-testid="selectButton"
          style={{ marginTop: '10px' }}
          className="btn"
          onClick={async () => {
            try {
              setLoading('Awaiting transaction approval');
              setError(false);

              const deployTx = await MemberNft.deploy({ ...deploymentConfig, provider });
              setAddress(deployTx.address);
              setLoading('Tx is being mined...');

              await deployTx.transaction.wait();
              setLoading(false);
            } catch (err:any) {
              setLoading(false);
              setError(err.message || 'There was a problem with deployment');
            }
          }}
        >
          Deploy new Member NFT contract
        </Button>
        {contractAddress ? (
          <div style={{ marginTop: '20px' }}>
            Contract Address
            <CopyToClipboard text={contractAddress} />
          </div>
        ) : null}
        {loading ? <Loading text={loading} /> : null}
        {error ? <Error text={error} /> : null}
      </Form.Group>
    </div>
  );
}

export default Deploy;
