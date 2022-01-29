import React from 'react';
import {
  Nav,
  Navbar,
  Container,
} from 'react-bootstrap';
import icon from '../images/zk_favicon.png';

function Sidebar() {
  return (
    <div className="float-left">
      <Navbar collapseOnSelect expand="md" bg="info" variant="dark">
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav">
            <img
              src={icon}
              width="30px"
              alt="ZKL"
            />
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="flex-column">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Sidebar;
