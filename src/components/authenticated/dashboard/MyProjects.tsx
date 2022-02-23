import React from 'react';
import {
  Container, Row, Col, Button,
} from 'react-bootstrap';

import { Plus } from 'react-bootstrap-icons';

function MyProjects() {
  return (
    <Container>
      <div className="my-projects-wrapper">
        <p className="my-projects-title">MY PROJECTS</p>
        <Row>
          <Col xs={4}>
            <div className="dashboard-create-project">
              <Button className="new-project-button">
                <Plus style={{ verticalAlign: 'bottom' }} size={24} />
                NEW PROJECT
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default MyProjects;
