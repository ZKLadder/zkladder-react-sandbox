import React from 'react';
import {
  Nav,
  Navbar,
  // Container,
} from 'react-bootstrap';
import icon from '../images/zk_favicon.png';
import style from '../styles/sidebar';

function Sidebar() {
  return (
    <div style={style.sidebar}>
      <Navbar expand="md" variant="dark">
        {/* <Container> */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav">
          <img
            src={icon}
            width="30px"
            alt="ZKL"
          />
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="flex-column">
            <Nav.Link href="#nfts">NFTs</Nav.Link>
            <Nav.Link href="#ipfs">IPFS</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>
    </div>
  );
}

export default Sidebar;
