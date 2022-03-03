import React from 'react';
import {
  Container, Row, Col, Button,
} from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import style from '../../styles/memberDashboard.module.css';

function MyProjects() {
  return (
    <Container>
      <div className={style['my-projects-wrapper']}>
        <p className={style['my-projects-title']}>MY PROJECTS</p>
        <Row>
          <Col xs={4}>
            <div className={style['dashboard-create-project']}>
              <Button className={style['new-project-button']}>
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
