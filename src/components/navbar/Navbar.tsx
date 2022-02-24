import React from 'react';
import OnboardingNavbar from './variants/Onboarding';
import AuthenticatedNavbar from './variants/Authenticated';

function ZKLNavbar({ variant }:{
    variant:'onboarding' | 'authenticated' | 'unauthenticated'
  }) {
  if (variant === 'onboarding') {
    return (
      <OnboardingNavbar />
    );
  }
  if (variant === 'authenticated') {
    return (
      <AuthenticatedNavbar />
    );
  }
  return <p>yo</p>;
}

export default ZKLNavbar;
