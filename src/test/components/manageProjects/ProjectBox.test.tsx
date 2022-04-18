import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { Ipfs, MemberNft } from '@zkladder/zkladder-sdk-ts';
import ProjectBox from '../../../components/manageProjects/ProjectBox';
import { contractState } from '../../../state/contract';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: jest.fn(),
  },
}));

const mockIpfs = Ipfs as jest.Mocked<any>;
const mockSetUp = MemberNft.setup as jest.Mocked<any>;

const initializeState = (settings:any) => {
  settings.set(contractState, [{
    address: '0xaddressToTest',
    whitelisted: 500,
    chainId: 31337,
    templateId: 3,
  }]);
};

describe('ProjectBox tests', () => {
  // It renders
  // It renders a placeholder

  beforeEach(() => {
    // Silence CSS margin warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));

    mockSetUp.mockResolvedValueOnce({
      getCollectionMetadata: () => ({
        image: 'ipfs://mockCID',
        name: 'MOCK ZKL CONTRACT',
      }),
      totalSupply: () => (100),
    });

    render(
      <RecoilRoot initializeState={initializeState}>
        <ProjectBox
          contract={{ address: '0xaddressToTest', chainId: 31337, templateId: 3 } as any}
        />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MOCK ZKL CONTRACT')).toBeVisible();
      expect(screen.getByText('100/500')).toBeVisible();
      expect(screen.getByText('Hardhat')).toBeVisible();
      expect(screen.getByText('Member NFT')).toBeVisible();
      expect(screen.getByTestId('image')).toHaveAttribute('src', 'https://mockCID');
    });
  });

  test('It renders a placeholder if the promise throws', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));

    mockSetUp.mockRejectedValueOnce({});

    render(
      <RecoilRoot initializeState={initializeState}>
        <ProjectBox
          contract={{ address: '0xaddressToTest', chainId: 31337, templateId: 3 } as any}
        />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('projectData')).not.toBeInTheDocument();
      expect(screen.queryByTestId('placeholder')).toBeVisible();
    });
  });
});
