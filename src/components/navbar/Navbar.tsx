import React from 'react';
import OnboardingNavbar from './variants/Onboarding';
import AuthenticatedNavbar from './variants/Authenticated';
import UnauthenticatedNavbar from './variants/Unauthenticated';

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

  if (variant === 'unauthenticated') {
    return (
      <UnauthenticatedNavbar />
    );
  }
  return <p>yo</p>;
}

export default ZKLNavbar;
