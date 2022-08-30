/* eslint-disable  */
import React, { useState } from 'react';
import {
  Modal, ListGroup, Badge, Row, Card, Spinner,
} from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { XSquare } from 'react-bootstrap-icons';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import { useRecoilState } from 'recoil';
import ErrorComponent from '../../../shared/Error';
import style from '../../../../styles/deploy.module.css';
import projectStyle from '../../../../styles/manageProjects.module.css';
import config from '../../../../config';
import { currentDropState } from '../../../../state/page';
import { getDrops, uploadAssets } from '../../../../utils/api';
import { Drop } from '../../../../interfaces/contract';

function UploadAssetModal({ show, onHide }:{show:boolean, onHide:()=>void}) {
  const [acceptedFiles, setAcceptedFiles] = useState([]) as any;
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const [currentDrop, setCurrentDrop] = useRecoilState(currentDropState);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 500,
    onDrop: (files) => {
      setAcceptedFiles(files);
    },
  });

  async function parseJsonFile(file:File) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try{
            resolve(JSON.parse(event?.target?.result as string))
          } catch (err){
            reject(file.name ? `File ${file.name} is not properly formatted JSON` : 'One of your files is not properly formatted JSON')
          }
        }
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
  }

  const closeModal = ()=>{
    setError(undefined);
    setAcceptedFiles([]);
    onHide();
  }

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
        <Modal.Title style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Upload Files (Max 500 at a Time)
        </Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body>

        {/* Drag and Drop Section */}
        <div {...getRootProps()}>
          <Card style={{ minHeight: '200px', width: '100%' }} className={style['file-upload']}>
            Add Files...
          </Card>
          <input data-testid="fileInput" {...getInputProps()} />
        </div>

        {/* File to be Uploaded Section */}
        <ListGroup style={{ maxHeight: '170px', overflow: 'auto' }}>
          {acceptedFiles.map((file:any) => (
            <ListGroup.Item key={file.name}>
              {file.name}
              <Badge bg="secondary" text="light" style={{ margin: '0px 5px 0px 10px', padding: '5px' }}>
                {file.size}
                {' '}
                bytes
              </Badge>
              <XSquare role="button" style={{ marginLeft: '5px' }} onClick={() => { setAcceptedFiles(acceptedFiles.filter((deletedFile:any) => (deletedFile.name !== file.name))); }} />
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Add Files Button*/}
        {acceptedFiles.length > 0
          ? (
            <div
              role="button"
              tabIndex={-1}
              style={{
                fontSize: '14px',
                padding: '15px',
                display: 'inline-block',
                margin: '6px 0px -10px 0px',
                borderRadius: '5px',
              }}
              className={projectStyle['add-whitelist-record']}
              onClick={async () => {
                try {
                  setLoading(true);
                  const instance = new Ipfs(config.ipfs.projectId, config.ipfs.projectSecret);

                    const promises = acceptedFiles.map((file:File)=>{
                      return parseJsonFile(file)
                    })
                    
                    await Promise.all(promises)

                  const cids = await instance.addFiles(
                    acceptedFiles.map((file:any) => ({ file, fileName: file.name })),
                  );

                  cids.pop();

                  const assets = await cids.map((cid) => ({
                    dropId: (currentDrop as Drop).id,
                    tokenUri: `ipfs://${cid.Hash}`,
                  }));

                  await uploadAssets({assets});

                  const [drop] = await getDrops({
                    id: currentDrop?.id,
                  });

                  setCurrentDrop(drop);
                  setLoading(false);
                  setAcceptedFiles([]);
                  closeModal(); 
                } catch (err: any) {
                  setLoading(false);
                  setError(err.message || err || 'Error uploading files to directory');
                }
              }}
            >
              UPLOAD
            </div>
          ) : null}
        {loading ? <Spinner style={{ color: '#4EB9B1', margin: '0px 0px -6px 15px' }} animation="border" /> : null}
      </Modal.Body>

      {/* Modal Footer */}
      <Modal.Footer style={{ padding: '0px 12px 10px 10px' }}>
        <Row>
          {error ? <ErrorComponent text={error} /> : null}
        </Row>
        <span
          className={projectStyle['remove-whitelist-record']}
          style={{
            fontSize: '14px', padding: '15px 20px 15px 20px', borderRadius: '5px',
          }}
          onClick={() => { closeModal(); }}
          role="button"
          tabIndex={-1}
        >
          CLOSE
        </span>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadAssetModal;
