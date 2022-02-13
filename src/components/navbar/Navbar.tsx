import React from 'react';
import OnboardingNavbar from './variants/Onboarding';

function ZKLNavbar({ variant }:{
    variant:'onboarding' | 'authenticated' | 'unauthenticated'
  }) {
  if (variant === 'onboarding') {
    return (
      <OnboardingNavbar />
    );
  }
  return <p>yo</p>;
}

export default ZKLNavbar;
