import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../../components/navbar/Navbar';

jest.mock('../../../components/navbar/variants/Onboarding', () => ({
  __esModule: true,
  default: () => <p>MINT NAVBAR</p>,
}));

jest.mock('../../../components/navbar/variants/Authenticated', () => ({
  __esModule: true,
  default: () => <p>AUTHENTICATED NAVBAR</p>,
}));

describe('Navbar component tests', () => {
  test('Correctly renders the mintNavbar variant', () => {
    render(<Navbar variant="onboarding" />);
    expect(screen.getByText('MINT NAVBAR')).toBeVisible();
  });

  test('Correctly renders the mintNavbar variant', () => {
    render(<Navbar variant="authenticated" />);
    expect(screen.getByText('AUTHENTICATED NAVBAR')).toBeVisible();
  });

  /* @TODO Add testing for other variants (authenticated & unauthenticated) */
});
