import React, { useEffect, useState } from 'react';
import {
  Card, Row, Spinner, Col,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { IpfsApiResponse } from '@zkladder/zkladder-sdk-ts/dist/interfaces/ipfs';
import { ipfsState, viewState } from '../../state/ipfs';
import '../../styles/error.css';

function FileView() {
  const { instance } = useRecoilValue(ipfsState);
  const view = useRecoilValue(viewState) as any;
  const [error, setError] = useState() as any;
  const [loading, setLoading] = useState() as any;
  const [files, setFiles] = useState([]) as any;

  useEffect(() => {
    const getFiles = async () => {
      try {
        if (instance) {
          setLoading(true);
          setError(undefined);
          const directoryContents = await instance.showDirectory(view.cid);
          setFiles(directoryContents);
          setLoading(false);
        }
      } catch (err:any) {
        setLoading(false);
        setError(err.message || 'Error loading files');
      }
    };
    getFiles();
  }, [view]);

  return (
    <Row>
      {files.slice(0, 100).map((file:IpfsApiResponse) => (
        <Col>
          <Card key={file.Hash} style={{ marginBottom: '10px', maxWidth: '25rem' }}>
            <a aria-label="View" target="_blank" href={file.gatewayUrl} rel="noreferrer">
              {(file.Name.toLowerCase().endsWith('png') || file.Name.toLowerCase().endsWith('jpg'))
                ? <Card.Img data-testid={file.Hash} variant="top" src={`${file.gatewayUrl}`} style={{ maxHeight: '20rem' }} />
                : <p data-testid={`${file.Hash}-file`} style={{ margin: '10px' }}>View File Data</p>}
            </a>
            <Card.Body>
              <Card.Title>{file.Name}</Card.Title>
              <Card.Text>
                {`ipfs://${file.Hash}`}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

      ))}
      {loading ? <Spinner style={{ marginTop: '20px' }} animation="border" role="status" /> : undefined}
      {error ? <p className="error">{error}</p> : undefined}
    </Row>
  );
}

export default FileView;
