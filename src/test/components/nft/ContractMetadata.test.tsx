import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { nftState } from '../../../state/nftContract';
import ContractMetadata from '../../../components/nft/ContractMetadata';

const initializeState = (settings:any) => {
  settings.set(nftState, {
    isSelected: true,
    address: '0x1234567890abce',
    instance: {
      name: jest.fn(() => ('ZKL-Test')),
      symbol: jest.fn(() => ('ZKLT')),
      totalSupply: jest.fn(),
      address: '0x1234567890abce',
    },
  });
};

describe('Contract Metadata component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <ContractMetadata />
        </React.Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('You are now connected to contract: 0x1234...abce')).toBeVisible();
      expect(screen.getByText('Contract Name: ZKL-Test')).toBeVisible();
      expect(screen.getByText('Contract Symbol: ZKLT')).toBeVisible();
    });
  });
});
