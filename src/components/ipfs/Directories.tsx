import React, { useEffect, useState } from 'react';
import {
  Spinner, Card, Form, Button, Col, Row,
} from 'react-bootstrap';
import { useRecoilValue, useRecoilState } from 'recoil';
import { ipfsState, viewState } from '../../state/ipfs';
import style from '../../styles/nft.module.css';
import Error from '../shared/Error';
import FileUpload from './FileUpload';

function Directories() {
  const { instance } = useRecoilValue(ipfsState);
  const [view, setViewState] = useRecoilState(viewState);
  const [error, setError] = useState() as any;
  const [loading, setLoading] = useState() as any;
  const [directories, setDirectories] = useState([]) as any;
  const [cidFormEntry, setCidFormEntry] = useState() as any;

  useEffect(() => {
    const getAllDirectories = async () => {
      setLoading(true);
      setError(false);
      try {
        const pinned = await instance?.getPinned();
        const recursive = Object.keys(pinned.Keys).filter((hash) => pinned.Keys[hash].Type === 'recursive');
        setDirectories([...recursive]);
        setLoading(false);
      } catch (err:any) {
        setLoading(false);
        setError(err.message || 'Error fetching pinned directories');
      }
    };
    if (instance) getAllDirectories();
  }, [instance, view.refreshCounter]);

  return (
    <div>
      {/* Directory List */}
      <Card.Title>Pinned Directories</Card.Title>
      <hr />
      <div style={{ maxHeight: '260px', overflow: 'auto' }}>
        {directories.length > 0
          ? directories.slice(0, 10).map((hash:string) => (
            <Card key={hash} data-testid={hash} className={style.tokenCard}>
              <Row>
                <Col xs={10}>
                  <Card.Title
                    onClick={() => {
                      setViewState({
                        view: 'cidView',
                        cid: hash,
                        refreshCounter: 0,
                      });
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    {`ipfs://${hash}`}
                  </Card.Title>
                </Col>
                <Col>
                  <Button
                    variant="danger"
                    onClick={async () => {
                      setLoading(true);
                      try {
                        await instance?.removeFile(hash);
                        setLoading(false);
                        setViewState({ ...view, refreshCounter: view.refreshCounter + 1 });
                      } catch (err:any) {
                        setLoading(false);
                        setError(err.message || 'There was an error unpinning this directory');
                      }
                    }}
                  >
                    Delete Directory
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
          : <p>No pinned directories</p>}
      </div>
      <hr />

      {/* Directory Lookup Form */}
      <Form.Group>
        <Form.Label>Or enter a known directory CID</Form.Label>
        <Form.Control
          data-testid="cidForm"
          onChange={(event) => { setCidFormEntry(event.target.value); }}
          type="text"
          style={{ width: '60%' }}
          placeholder="Qm..."
        />
        <Button
          data-testid="selectButton"
          style={{ marginTop: '10px' }}
          className="btn"
          onClick={async () => {
            setViewState({
              view: 'cidView',
              cid: cidFormEntry,
              refreshCounter: 0,
            });
          }}
        >
          Lookup Directory
        </Button>
      </Form.Group>

      {/* Loading and Error Indicators */}
      {loading ? (
        <div>
          <Spinner style={{ marginTop: '15px' }} animation="border" role="status" />
          <p style={{ marginTop: '5px' }}>This may take a minute ...</p>
        </div>
      ) : undefined}
      {error ? <Error text={error} /> : undefined}
      <hr />

      {/* Create a New Directory */}
      <Form.Label>Upload files into a new directory</Form.Label>
      <FileUpload createNewDirectory />
    </div>

  );
}

export default Directories;
