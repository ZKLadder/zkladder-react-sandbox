import React from 'react';
import MintNavbar from './variants/MintNavbar';

function ZKLNavbar({ variant }:{
    variant:'memberMint' | 'authenticated' | 'unauthenticated'
  }) {
  if (variant === 'memberMint') {
    return (
      <MintNavbar />
    );
  }
  return <p>yo</p>;
}

export default ZKLNavbar;
