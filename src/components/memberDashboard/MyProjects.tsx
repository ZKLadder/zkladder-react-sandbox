import React from 'react';
import {
  Container, Row, Col, Button,
} from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import style from '../../styles/memberDashboard.module.css';

function MyProjects() {
  return (
    <Container>
      <div className={style['my-projects-wrapper']}>
        <p className={style['my-projects-title']}>MY PROJECTS</p>
        <Row>
          <Col lg={4}>
            <div className={style['dashboard-create-project']}>
              <Link to="/deploy">
                <Button className={style['new-project-button']}>
                  <Plus style={{ verticalAlign: 'bottom' }} size={24} />
                  NEW PROJECT
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default MyProjects;
