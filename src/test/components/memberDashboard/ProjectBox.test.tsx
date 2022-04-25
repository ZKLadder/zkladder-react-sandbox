import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import ProjectBox from '../../../components/memberDashboard/ProjectBox';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: async () => ({
      getCollectionMetadata: async () => ({ name: 'Test Name', image: 'ipfs://123456789' }),
      totalSupply: async () => (100),
    }),
  },
}));

const mockIpfs = Ipfs as jest.Mocked<any>;

describe('ProjectBox tests', () => {
  test('It renders', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: jest.fn() }));

    render(
      <RecoilRoot>
        <ProjectBox
          address="0x123456789"
          chainId="4"
          whitelisted={10}
        />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test Name')).toBeVisible();
      expect(screen.getByText('Whitelist')).toBeVisible();
      expect(screen.getByText('10')).toBeVisible();
      expect(screen.getByText('Members')).toBeVisible();
      expect(screen.getByText('100')).toBeVisible();
    });
  });
});
