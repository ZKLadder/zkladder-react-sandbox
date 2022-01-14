import React from 'react';
import {
  Nav,
  Navbar,
  NavDropdown,
  ListGroup,
} from 'react-bootstrap';
import sidebarStyle from '../styles/sidebar';

function Sidebar() {
  return (
    <div className="sidebar" style={sidebarStyle.nav}>
      <Navbar collapseOnSelect expand="lg" className="sidebar-nav">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="flex-column">
            <NavDropdown title="NFTs">
              <ListGroup.Item href="#">Item 1.1</ListGroup.Item>
              <ListGroup.Item href="#">Item 1.2</ListGroup.Item>
              <ListGroup.Item href="#">Item 1.3</ListGroup.Item>
            </NavDropdown>
            <NavDropdown title="IFPS">
              <ListGroup.Item href="#">Item 2.1</ListGroup.Item>
              <ListGroup.Item href="#">Item 2.2</ListGroup.Item>
              <ListGroup.Item href="#">Item 2.3</ListGroup.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default Sidebar;
