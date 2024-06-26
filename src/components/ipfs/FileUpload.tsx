/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Spinner, Button, ListGroup, Badge,
} from 'react-bootstrap';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useDropzone } from 'react-dropzone';
import { ipfsState, viewState } from '../../state/ipfs';
import Error from '../shared/Error';
import style from '../../styles/ipfs.module.css';
import { FileUploadProps } from '../../interfaces/ipfs';

function saveFile(filename:string, text:string) {
  const pom = document.createElement('a');
  pom.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  pom.setAttribute('download', filename);

  if (document.createEvent) {
    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
}

function FileUpload(props: FileUploadProps) {
  const [acceptedFiles, setAcceptedFiles] = useState([]) as any;
  const [loading, setLoading] = useState() as any;
  const [error, setError] = useState();
  const [view, setViewState] = useRecoilState(viewState);
  const { instance } = useRecoilValue(ipfsState);

  const { createNewDirectory } = props;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      setAcceptedFiles(files);
    },
  });

  const [download, setDownload] = useState({});

  return (
    <div>
      {/* Drag and Drop Section */}
      <div className={style['file-drop-zone']} {...getRootProps({})}>
        <input data-testid="fileInput" {...getInputProps()} />
        <p>Drag and drop a file or directory</p>
      </div>
      <aside>

        {/* Files to Be Uploaded Section */}
        <ListGroup style={{ maxHeight: '170px', overflow: 'auto' }}>
          {acceptedFiles.map((file:any) => (
            <ListGroup.Item key={file.name}>
              {file.name}
              <Badge bg="secondary" text="light" style={{ marginLeft: '10px' }}>
                {file.size}
                {' '}
                bytes
              </Badge>
              {' '}
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Upload Button */}
        {acceptedFiles.length > 0
          ? (
            <div>
              <Button
                style={{ margin: '10px' }}
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError(undefined);
                    let newDirectoryCid;
                    if (createNewDirectory) {
                      const cids = await instance?.addFiles(
                        acceptedFiles.map((file:any) => ({ file, fileName: file.name })),
                      );

                      const files:{ [key: string]: any } = {};
                      cids?.forEach((cid) => {
                        if (cid.Name.length > 1) files[cid.Name] = `ipfs://${cid.Hash}`;
                      });

                      setDownload(files);
                    } else {
                      newDirectoryCid = await instance?.addFilesToDirectory(
                        acceptedFiles.map((file:any) => ({ file, fileName: file.name })),
                        view.cid,
                      );
                    }
                    setLoading(false);
                    setAcceptedFiles([]);
                    setViewState({ ...view, cid: newDirectoryCid?.Hash || view.cid, refreshCounter: view.refreshCounter + 1 });
                  } catch (err: any) {
                    setLoading(false);
                    setError(err.message || 'Error uploading files to directory');
                  }
                }}
              >
                Upload files to IPFS
              </Button>

              {/* Clear Selection Button */}
              <Button
                style={{ margin: '10px' }}
                onClick={() => {
                  setAcceptedFiles([]);
                }}
              >
                Clear Selection
              </Button>

              {/* Loading and Error Indicators */}
              {loading ? (
                <div>
                  <Spinner style={{ marginTop: '20px' }} animation="border" role="status" />
                  <p>This may take a minute ...</p>
                </div>
              ) : undefined}
              {error ? <Error text={error} /> : undefined}
            </div>
          ) : null}
      </aside>
      <hr />
      {Object.keys(download).length > 0
        ? (
          <Button
            style={{ margin: '10px' }}
            onClick={() => {
              saveFile('Ipfs-Hashes.json', JSON.stringify(download, null, 4));
            }}
          >
            Download IPFS Hashes
          </Button>
        ) : null}
    </div>
  );
}

export default FileUpload;
