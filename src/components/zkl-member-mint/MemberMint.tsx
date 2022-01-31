import React from 'react';
import PageBody from '../shared/PageBody';
import '../../styles/body.css';
import Navbar from '../navbar/Navbar';

function MemberMint() {
  return (
    <PageBody color={{ start: '#16434B', end: '#4EB9B1' }}>
      <Navbar variant="memberMint" />
      {/* @TODO Add Body Component */}
    </PageBody>
  );
}

export default MemberMint;
