import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProjectBox from '../../../components/manageProjects/ProjectBox';
import { contractsState } from '../../../state/contract';
import { mockMemberNftInstance } from '../../mocks';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: () => (mockMemberNftInstance),
  },
}));

const mockIpfs = Ipfs as jest.Mocked<any>;

const initializeState = (settings:any) => {
  settings.set(contractsState, [{
    address: '0xaddressToTest',
    whitelisted: 500,
    chainId: 31337,
    templateId: 1,
  }]);
};

describe('ProjectBox tests', () => {
  beforeEach(() => {
    // Silence CSS margin warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));

    mockMemberNftInstance.getCollectionMetadata.mockResolvedValueOnce({
      image: 'ipfs://mockCID',
      name: 'MOCK ZKL CONTRACT',
    });

    mockMemberNftInstance.totalSupply.mockResolvedValueOnce(100);

    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <ProjectBox
            contract={{ address: '0xaddressToTest', chainId: 31337, templateId: 1 } as any}
          />
        </MemoryRouter>
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

    mockMemberNftInstance.getCollectionMetadata.mockRejectedValueOnce({ mock: 'error' });

    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <ProjectBox
            contract={{ address: '0xaddressToTest', chainId: 31337, templateId: 1 } as any}
          />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('projectData')).not.toBeInTheDocument();
      expect(screen.queryByTestId('placeholder')).toBeVisible();
    });
  });

  test('Clicking the project updates the route', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));

    mockMemberNftInstance.getCollectionMetadata.mockResolvedValueOnce({
      image: 'ipfs://mockCID',
      name: 'MOCK ZKL CONTRACT',
    });

    mockMemberNftInstance.totalSupply.mockResolvedValueOnce(100);

    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Routes>
            <Route path="/projects/0xaddressToTest" element={<p>PROJECT COMPONENT</p>} />
            <Route
              path="*"
              element={(
                <ProjectBox
                  contract={{ address: '0xaddressToTest', chainId: 31337, templateId: 1 } as any}
                />
            )}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MOCK ZKL CONTRACT')).toBeVisible();
    });

    await userEvent.click(screen.getByText('MOCK ZKL CONTRACT'));

    await waitFor(() => {
      expect(screen.getByText('PROJECT COMPONENT')).toBeVisible();
    });
  });
});
