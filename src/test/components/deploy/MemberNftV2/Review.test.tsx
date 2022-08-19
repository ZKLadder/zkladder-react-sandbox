import React, { useEffect } from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import userEvent from '@testing-library/user-event';
import { Ipfs, MemberNftV2 } from '@zkladder/zkladder-sdk-ts';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Review from '../../../../components/deploy/memberNftV2/Review';
import { deployState } from '../../../../state/deploy';
import { walletState } from '../../../../state/wallet';
import { createContract } from '../../../../utils/api';
import { switchChain } from '../../../../utils/walletConnect';
import { errorState } from '../../../../state/page';

global.URL.createObjectURL = jest.fn(() => ('mockData.png'));

const mockImage = new File(['image'], 'mockImage.png', {
  type: 'image/png',
});

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(),
  MemberNftV2: { deploy: jest.fn(() => ({ address: '0xnewcontract', transaction: { wait: jest.fn() } })) },
}));

jest.mock('../../../../config', () => ({
  ipfs: {
    projectId: 'mockProjectId',
    projectSecret: 'mockProjectSecret',
  },
}));

jest.mock('../../../../utils/api', () => ({
  createContract: jest.fn(),
}));

jest.mock('../../../../utils/walletConnect', () => ({
  switchChain: jest.fn(),
}));

jest.mock('../../../../constants/networks', () => ({
  1: {
    label: 'ETHEREUM',
    chainId: '0x1',
  },
  2: {
    label: 'SECOND',
    chainId: '0x2',
  },
  3: {
    label: 'THIRD',
    chainId: '0x3',
  },
}));

const initializeState = (settings:any) => {
  settings.set(deployState, {
    currentStep: 3,
    config: {
      name: 'mock contract',
      symbol: 'mock symbol',
      description: 'mock description',
      beneficiaryAddress: '0xuser',
      image: mockImage,
      external_link: 'https://mock.com',

    },
  });
  settings.set(walletState, {
    chainId: 4,
    provider: 'MOCKPROVIDER',
    address: ['mockuser'],
  });
};

const mockIpfs = Ipfs as jest.Mocked<any>;
const mockDeploy = MemberNftV2.deploy as jest.Mocked<any>;
const mockCreateContract = createContract as jest.Mocked<any>;
const mockSwitchChain = switchChain as jest.Mocked<any>;

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

describe('DefineRoles component tests', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Review />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('mock contract')).toBeVisible();
      expect(screen.getByText('mock symbol')).toBeVisible();
      expect(screen.getByText('mock description')).toBeVisible();
      expect(screen.getByText('https://mock.com')).toBeVisible();
      expect(screen.getByText('0xuser')).toBeVisible();
      expect(screen.getByText('Network:')).toBeVisible();
      expect(screen.getByText('Community Name:')).toBeVisible();
      expect(screen.getByText('Collection Symbol:')).toBeVisible();
      expect(screen.getByText('Community Web URL:')).toBeVisible();
      expect(screen.getByText('Beneficiary Address:')).toBeVisible();
      expect(screen.getByText('Community Description:')).toBeVisible();
    });
  });

  test('Deploy workflow', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Routes>
            <Route path="projects" element={<p>PROJECTS</p>} />
            <Route path="*" element={<Review />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>,
    );

    const addFiles = jest.fn();

    mockIpfs.mockImplementation(() => ({ addFiles }));

    addFiles.mockResolvedValueOnce([{
      Hash: 'imagehash',
    }]);

    mockDeploy.mockResolvedValueOnce({ address: '0xmockContract', transaction: { wait: () => {} } });

    await userEvent.click(screen.getByText('DEPLOY YOUR SMART CONTRACT'));

    await waitFor(() => {
      expect(mockDeploy).toHaveBeenCalledWith({
        provider: 'MOCKPROVIDER',
        collectionData: {
          name: 'mock contract',
          symbol: 'mock symbol',
          description: 'mock description',
          beneficiaryAddress: '0xuser',
          image: 'ipfs://imagehash',
          external_link: 'https://mock.com',
        },
        infuraIpfs: {
          projectId: 'mockProjectId',
          projectSecret: 'mockProjectSecret',
        },
      });

      expect(mockCreateContract).toHaveBeenCalledWith({
        address: '0xmockContract',
        creator: 'mockuser',
        chainId: '4',
        templateId: '3',
      });
    });

    /* eslint-disable-next-line */
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await waitFor(() => {
      expect(screen.getByText('PROJECTS')).toBeVisible();
    });
  });

  test('Errors are displayed', async () => {
    const errorStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={errorState} onChange={errorStateObserver} />
        <MemoryRouter>
          <Review />
        </MemoryRouter>
      </RecoilRoot>,
    );

    const addFiles = jest.fn();

    mockIpfs.mockImplementation(() => ({ addFiles }));

    addFiles.mockResolvedValueOnce([{
      Hash: 'imagehash',
    }]);

    mockDeploy.mockRejectedValueOnce(new Error('An error occured'));

    await userEvent.click(screen.getByText('DEPLOY YOUR SMART CONTRACT'));

    await waitFor(() => {
      expect(errorStateObserver).toHaveBeenCalledWith({
        showError: true,
        content: 'An error occured',
      });
    });
  });

  test('Back button correctly updates state', async () => {
    const deployStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={deployState} onChange={deployStateObserver} />
        <MemoryRouter>
          <Review />
        </MemoryRouter>
      </RecoilRoot>,
    );

    userEvent.click(screen.getByText('RETURN TO CONTRACT CONFIGURATION'));

    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        currentStep: 2,
      }));
    });
  });

  test('Switch chain workflow', async () => {
    mockSwitchChain.mockResolvedValue({});
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Review />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('dropdown'));

    await waitFor(() => {
      expect(screen.getByText('ETHEREUM')).toBeVisible();
      expect(screen.getByText('SECOND')).toBeVisible();
      expect(screen.getByText('THIRD')).toBeVisible();
    });

    await userEvent.click(screen.getByTestId('ETHEREUM'));

    await waitFor(() => {
      expect(mockSwitchChain).toHaveBeenCalledWith('1');
    });
  });
});
