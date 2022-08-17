import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProjectBody from '../../../../components/manageProjects/memberNftV2/ProjectBody';
import { contractsState, selectedContractState } from '../../../../state/contract';
import { mockMemberNftInstance } from '../../../mocks';
import { walletState } from '../../../../state/wallet';
import { switchChain } from '../../../../utils/walletConnect';
import { nftContractUpdates } from '../../../../state/nftContract';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNftV2: {
    setup: () => (mockMemberNftInstance),
  },
  utilities: { isEthereumAddress: () => (true) },
}));

jest.mock('../../../../components/manageProjects/Collection', () => ({
  __esModule: true,
  default: () => <p>COLLECTION COMPONENT</p>,
}));

jest.mock('../../../../components/manageProjects/memberNftV2/Settings', () => ({
  __esModule: true,
  default: () => <p>SETTINGS COMPONENT</p>,
}));

jest.mock('../../../../components/manageProjects/memberNftV2/Tiers', () => ({
  __esModule: true,
  default: () => <p>TIERS COMPONENT</p>,
}));

jest.mock('../../../../components/manageProjects/memberNftV2/Drops', () => ({
  __esModule: true,
  default: () => <p>DROPS COMPONENT</p>,
}));

jest.mock('../../../../components/manageProjects/Admins', () => ({
  __esModule: true,
  default: () => <p>ADMINS COMPONENT</p>,
}));

jest.mock('../../../../utils/walletConnect', () => ({
  switchChain: jest.fn(),
}));

const contracts = [
  { address: '0xselectedContract', chainId: '1', templateId: '3' },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
};

const initializeWrongChainState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '2', provider: jest.fn(),
  });
};

const initializeContractUpdatesState = (settings:any) => {
  settings.set(selectedContractState, { address: '0xselectedContract' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(nftContractUpdates, {
    description: 'Mock description',
    external_link: 'https://mock.com',
    beneficiaryAddress: '0xmockBeneficiary',
    tiers: [
      {
        tierId: 0, name: 'test1', description: 'test1', image: 'ipfs://123456789', isTransferable: true, salePrice: 2.5, royaltyBasis: 250,
      },
      {
        tierId: 1, name: 'test2', description: 'test2', image: 'dataBlob', isTransferable: false, salePrice: 3.5, royaltyBasis: 350,
      },
      {
        tierId: 2, name: 'test3', description: 'test3', image: 'dataBlob', isTransferable: true, salePrice: 4.5, royaltyBasis: 450,
      },
    ],
  });
};

const mockIpfs = Ipfs as jest.Mocked<any>;
const mockSwitchChain = switchChain as jest.Mocked<any>;

describe('ProjectBody tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('It renders', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));
    mockMemberNftInstance.totalSupply.mockResolvedValue(1);
    mockMemberNftInstance.getTiers.mockResolvedValue([
      {
        name: 'test', description: 'test', image: 'ipfs://123456789', isTransferable: false, salePrice: 1.5, royaltyBasis: 150,
      },
    ]);

    render(
      <RecoilRoot initializeState={initializeState}>
        <MemoryRouter>
          <ProjectBody isUnitTest />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('COLLECTION COMPONENT')).toBeVisible();
    });

    await userEvent.click(screen.getByText('SETTINGS'));

    await waitFor(() => {
      expect(screen.getByText('SETTINGS COMPONENT')).toBeVisible();
    });

    await userEvent.click(screen.getByText('TIERS'));

    await waitFor(() => {
      expect(screen.getByText('TIERS COMPONENT')).toBeVisible();
    });

    await userEvent.click(screen.getByText('DROPS'));

    await waitFor(() => {
      expect(screen.getByText('DROPS COMPONENT')).toBeVisible();
    });

    await userEvent.click(screen.getByText('ADMINS'));

    await waitFor(() => {
      expect(screen.getByText('ADMINS COMPONENT')).toBeVisible();
    });
  });

  test('Wrong chain workflow', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));

    render(
      <RecoilRoot initializeState={initializeWrongChainState}>
        <MemoryRouter>
          <ProjectBody isUnitTest />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('You must connect your wallet to Ethereum Mainnet to manage this project')).toBeVisible();
    });

    await userEvent.click(screen.getByText('SWITCH CHAIN'));

    await waitFor(() => {
      expect(mockSwitchChain).toHaveBeenCalledWith('1');
    });
  });

  test('Contract updates workflow', async () => {
    mockIpfs.mockImplementation(() => ({
      addFiles: () => [{
        Hash: 'metaDataCid',
      }],
    }));

    mockMemberNftInstance.setContractUri.mockResolvedValue({ wait: jest.fn() });
    mockMemberNftInstance.setBeneficiary.mockResolvedValue({ wait: jest.fn() });
    mockMemberNftInstance.addTiers.mockResolvedValue({ wait: jest.fn() });
    mockMemberNftInstance.updateTiers.mockResolvedValue({ wait: jest.fn() });

    render(
      <RecoilRoot initializeState={initializeContractUpdatesState}>
        <MemoryRouter>
          <ProjectBody isUnitTest />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('You have changes pending for this contract')).toBeVisible();
    });

    await userEvent.click(screen.getByText('SAVE CHANGES'));

    await waitFor(() => {
      expect(mockMemberNftInstance.setContractUri).toHaveBeenCalledWith('ipfs://metaDataCid');
      expect(mockMemberNftInstance.setBeneficiary).toHaveBeenCalledWith('0xmockBeneficiary');
      expect(mockMemberNftInstance.addTiers).toHaveBeenCalledWith([{
        name: 'test2', description: 'test2', image: 'ipfs://metaDataCid', isTransferable: false, salePrice: 3.5, royaltyBasis: 350,
      },
      {
        name: 'test3', description: 'test3', image: 'ipfs://metaDataCid', isTransferable: true, salePrice: 4.5, royaltyBasis: 450,
      }]);
      expect(mockMemberNftInstance.updateTiers).toHaveBeenCalledWith([{
        tierId: 0,
        tierUpdates: {
          name: 'test1', description: 'test1', image: 'ipfs://123456789', isTransferable: true, salePrice: 2.5, royaltyBasis: 250,
        },
      }]);
    });
  });
});
