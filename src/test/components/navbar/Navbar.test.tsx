import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../../components/navbar/Navbar';

jest.mock('../../../components/navbar/variants/MintNavbar', () => ({
  __esModule: true,
  default: () => <p>MINT NAVBAR</p>,
}));

describe('Navbar component tests', () => {
  test('Correctly renders the mintNavbar variant', () => {
    render(<Navbar variant="memberMint" />);
    expect(screen.getByText('MINT NAVBAR')).toBeVisible();
  });

  /* @TODO Add testing for other variants (authenticated & unauthenticated) */
});
