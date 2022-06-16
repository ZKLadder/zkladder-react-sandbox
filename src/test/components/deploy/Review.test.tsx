import React, { useEffect } from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import userEvent from '@testing-library/user-event';
import { Ipfs, MemberNft } from '@zkladder/zkladder-sdk-ts';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Review from '../../../components/deploy/Review';
import { deployState } from '../../../state/deploy';
import { walletState } from '../../../state/wallet';
import { createContract } from '../../../utils/api';

global.URL.createObjectURL = jest.fn(() => ('mockData.png'));

const mockScript = new File(['script'], 'mockScript.js', {
  type: 'text/javascript',
});

const mockImage = new File(['image'], 'mockImage.png', {
  type: 'image/png',
});

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(),
  MemberNft: { deploy: jest.fn(() => ({ address: '0xnewcontract', transaction: { wait: jest.fn() } })) },
}));

jest.mock('../../../config', () => ({
  ipfs: {
    projectId: 'mockProjectId',
    projectSecret: 'mockProjectSecret',
  },
}));

jest.mock('../../../utils/api', () => ({
  createContract: jest.fn(),
}));

const roles = [
  {
    name: 'Test Role', description: 'Test Description', id: 'Test Id', price: 100,
  },
  {
    name: 'Role2', description: 'Role2 Description', id: 'Role2 Id', price: 5,
  },
];

const initializeState = (settings:any) => {
  settings.set(deployState, {
    currentStep: 3,
    config: {
      name: 'mock contract',
      symbol: 'mock symbol',
      description: 'mock description',
      beneficiaryAddress: '0xuser',
      image: mockImage,
      script: mockScript,

    },
    roles,
  });
  settings.set(walletState, {
    chainId: 4,
    provider: 'MOCKPROVIDER',
    address: ['mockuser'],
  });
};

const mockIpfs = Ipfs as jest.Mocked<any>;
const mockDeploy = MemberNft.deploy as jest.Mocked<any>;
const mockCreateContract = createContract as jest.Mocked<any>;

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

describe('DefineRoles component tests', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
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
      expect(screen.getByText('0xuser')).toBeVisible();
      expect(screen.getByText('Test Role')).toBeVisible();
      expect(screen.getByText('Test Description')).toBeVisible();
      expect(screen.getByText('Test Id')).toBeVisible();
      expect(screen.getByText('100 RIN')).toBeVisible();
      expect(screen.getByText('Role2')).toBeVisible();
      expect(screen.getByText('Role2 Description')).toBeVisible();
      expect(screen.getByText('Role2 Id')).toBeVisible();
      expect(screen.getByText('5 RIN')).toBeVisible();
      expect(screen.getByText('mockScript.js')).toBeVisible();
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
    }]).mockResolvedValueOnce([{
      Hash: 'scriptHash',
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
          script: 'ipfs://scriptHash',
          roles,
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
        templateId: '1',
      });
    });

    /* eslint-disable-next-line */
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await waitFor(() => {
      expect(screen.getByText('PROJECTS')).toBeVisible();
    });
  });

  test('Errors are displayed', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <Review />
        </MemoryRouter>
      </RecoilRoot>,
    );

    const addFiles = jest.fn();

    mockIpfs.mockImplementation(() => ({ addFiles }));

    addFiles.mockResolvedValueOnce([{
      Hash: 'imagehash',
    }]).mockResolvedValueOnce([{
      Hash: 'scriptHash',
    }]);

    mockDeploy.mockRejectedValueOnce(new Error('An error occured'));

    await userEvent.click(screen.getByText('DEPLOY YOUR SMART CONTRACT'));

    await waitFor(() => {
      expect(screen.getByText('An error occured')).toBeVisible();
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

    userEvent.click(screen.getByText('RETURN TO ROLE CONFIGURATION'));

    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        currentStep: 3,
      }));
    });
  });
});
