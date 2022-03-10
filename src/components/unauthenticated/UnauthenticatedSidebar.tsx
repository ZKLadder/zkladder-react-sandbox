import React from 'react';
import {
  Container,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import logo from '../../images/memberMint/logo_transparent.png';
import '../../styles/unauthenticated.css';

function UnauthenticatedSidebar() {
  return (
    <Container>
      <img
        alt=""
        src={logo}
        width="205"
        height="35"
      />
      {/* Description */}
      <p className="description">
        Welcome to the ZKLadder DAO and the overall ZKLadder Community.
        We are a community of developers, creatives, entrepreneurs and industry
        experts that support curated DAOs and NFT projects with an emphasis on support.
      </p>

      {/* Info cards */}
      {/* TODO: replace dummy numbers with actual figures culled from api. */}
      <Row className="card-row">
        <Card className="sidebar-card">
          <Card.Body>
            <Card.Text>
              <Row>
                <Col className="column number-text"><span><b>125 </b></span></Col>
                <Col className="column card-text"><span>Producers</span></Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="sidebar-card">
          <Card.Body>
            <Card.Text>
              <Row>
                <Col className="column number-text"><span><b>74 </b></span></Col>
                <Col className="column card-text"><span>Members</span></Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>

      <Row className="card-row">
        <Card className="sidebar-card">
          <Card.Body>
            <Card.Text>
              <Row>
                <Col className="column number-text"><span><b>82 </b></span></Col>
                <Col className="column card-text"><span>Partner DAOs Launched</span></Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="sidebar-card">
          <Card.Body>
            <Card.Text>
              <Row>
                <Col className="column number-text"><span><b>125 </b></span></Col>
                <Col className="column card-text"><span>NFTs Minted</span></Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>

    </Container>
  );
}

export default UnauthenticatedSidebar;
