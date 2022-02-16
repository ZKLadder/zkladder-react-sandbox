/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Modal, Button, ListGroup, Badge, Row, Col,
} from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { XSquare } from 'react-bootstrap-icons';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import Error from '../shared/Error';
import Loading from '../shared/Loading';
import CopyToClipboard from '../shared/CopyToClipboard';
import '../../styles/ipfs.css';
import config from '../../config';

function FileUploadModal({ show, onHide }:{show:boolean, onHide:()=>void}) {
  const [acceptedFiles, setAcceptedFiles] = useState([]) as any;
  const [ipfsCids, setIpfsCids] = useState({ fileHash: '', withDirectory: '' });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (files) => {
      setAcceptedFiles(files);
    },
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {/* Modal Header */}
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Upload to IPFS
        </Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body>

        {/* Drag and Drop Section */}
        <div className="file-drop-zone" {...getRootProps({ })}>
          <input data-testid="fileInput" {...getInputProps()} />
          <p>Drag and drop a file to get started</p>
        </div>

        {/* File to be Uploaded Section */}
        <ListGroup style={{ maxHeight: '170px', overflow: 'auto' }}>
          {acceptedFiles.map((file:any) => (
            <ListGroup.Item key={file.name}>
              {file.name}
              <Badge bg="secondary" text="light" style={{ marginLeft: '10px' }}>
                {file.size}
                {' '}
                bytes
              </Badge>
              <XSquare style={{ marginLeft: '5px' }} onClick={() => { setAcceptedFiles([]); }} />
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Add Files to IPFS Button */}
        {acceptedFiles.length > 0
          ? (
            <Button
              style={{ margin: '10px' }}
              onClick={async () => {
                try {
                  setIpfsCids({ fileHash: '', withDirectory: '' });
                  setLoading(true);
                  setError(undefined);

                  const instance = new Ipfs(config.ipfs.projectId, config.ipfs.projectSecret);

                  const cids = await instance.addFiles(
                    acceptedFiles.map((file:any) => ({ file, fileName: file.name })),
                  );

                  setIpfsCids({
                    fileHash: `ipfs://${cids[0].Hash}`,
                    withDirectory: `ipfs://${cids[1].Hash}/${cids[0].Name}`,
                  });

                  setLoading(false);
                } catch (err: any) {
                  setLoading(false);
                  setError(err.message || 'Error uploading files to directory');
                }
              }}
            >
              Upload file to IPFS
            </Button>
          ) : null}
      </Modal.Body>

      {/* Modal Footed */}
      <Modal.Footer>
        <Row>
          {loading ? <Loading /> : null}
          {error ? <Error text={error} /> : null}

          {/* IPFS CID's */}
          {ipfsCids.fileHash ? <Col xs={6}><CopyToClipboard text={ipfsCids.fileHash} /></Col> : null}
          {ipfsCids.withDirectory ? <Col xs={6}><CopyToClipboard text={ipfsCids.withDirectory} /></Col> : null}
        </Row>
        <Button onClick={() => { onHide(); }}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FileUploadModal;
