import React from 'react';
import {
  Card, Form, Button, Row, Col,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { viewState } from '../../state/ipfs';
import FileUpload from './FileUpload';
import FileView from './FileView';

function DirectoryExplorer() {
  const [view, setViewState] = useRecoilState(viewState) as any;

  return (
    <div>
      <Row>
        {/* Header */}
        <Col xs={9} style={{ padding: '8px' }}>
          <Card.Title>
            Viewing Directory ipfs://
            {view.cid}
          </Card.Title>
        </Col>

        {/* Back Button */}
        <Col xs={2}>
          <Button
            data-testid="backButton"
            className="btn"
            onClick={async () => {
              setViewState({ view: 'directoryView', cid: '', refreshCounter: 0 });
            }}
          >
            {' '}
            Back to Directory Select
            {' '}

          </Button>

        </Col>
      </Row>
      <hr />

      {/* File Upload */}
      <Form.Label className="me-auto"> Add files (this will change the directory CID) </Form.Label>
      <FileUpload createNewDirectory={false} />

      {/* File List */}
      <FileView />

    </div>
  );
}

export default DirectoryExplorer;
