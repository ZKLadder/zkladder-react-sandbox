import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProjectBody from '../../../components/manageProjects/ProjectBody';
import { contractsState, selectedContractState } from '../../../state/contract';
import { mockMemberNftInstance } from '../../mocks';
import { walletState } from '../../../state/wallet';
import { switchChain } from '../../../utils/walletConnect';
import { nftContractUpdates } from '../../../state/nftContract';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNft: {
    setup: () => (mockMemberNftInstance),
  },
  utilities: { isEthereumAddress: () => (true) },
}));

jest.mock('../../../components/manageProjects/Collection', () => ({
  __esModule: true,
  default: () => <p>COLLECTION COMPONENT</p>,
}));

jest.mock('../../../components/manageProjects/Settings', () => ({
  __esModule: true,
  default: () => <p>SETTINGS COMPONENT</p>,
}));

jest.mock('../../../components/manageProjects/Roles', () => ({
  __esModule: true,
  default: () => <p>ROLES COMPONENT</p>,
}));

jest.mock('../../../components/manageProjects/Whitelist', () => ({
  __esModule: true,
  default: () => <p>WHITELIST COMPONENT</p>,
}));

jest.mock('../../../components/manageProjects/Admins', () => ({
  __esModule: true,
  default: () => <p>ADMINS COMPONENT</p>,
}));

jest.mock('../../../utils/walletConnect', () => ({
  switchChain: jest.fn(),
}));

const contracts = [
  { address: '0xselectedContract', chainId: '1', templateId: '1' },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, '0xselectedContract');
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
};

const initializeWrongChainState = (settings: any) => {
  settings.set(selectedContractState, '0xselectedContract');
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '2', provider: jest.fn(),
  });
};

const initializeContractUpdatesState = (settings:any) => {
  settings.set(selectedContractState, '0xselectedContract');
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(nftContractUpdates, {
    description: 'Mock description',
    royaltyBasis: 1000,
    beneficiaryAddress: '0xmockBeneficiary',
    isTransferable: false,
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

    await userEvent.click(screen.getByText('ROLES'));

    await waitFor(() => {
      expect(screen.getByText('ROLES COMPONENT')).toBeVisible();
    });

    await userEvent.click(screen.getByText('WHITELIST'));

    await waitFor(() => {
      expect(screen.getByText('WHITELIST COMPONENT')).toBeVisible();
    });

    await userEvent.click(screen.getByText('ADMINS'));

    await waitFor(() => {
      expect(screen.getByText('ADMINS COMPONENT')).toBeVisible();
    });
  });

  test('Wrong chain workflow', async () => {
    mockIpfs.mockImplementation(() => ({ getGatewayUrl: () => ('https://mockCID') }));
    mockMemberNftInstance.totalSupply.mockResolvedValue(1);

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
    mockMemberNftInstance.totalSupply.mockResolvedValue(1);
    mockMemberNftInstance.setContractUri.mockResolvedValue({ wait: jest.fn() });
    mockMemberNftInstance.setRoyalty.mockResolvedValue({ wait: jest.fn() });
    mockMemberNftInstance.setBeneficiary.mockResolvedValue({ wait: jest.fn() });
    mockMemberNftInstance.setIsTransferrable.mockResolvedValue({ wait: jest.fn() });

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
      expect(mockMemberNftInstance.setRoyalty).toHaveBeenCalledWith(1000);
      expect(mockMemberNftInstance.setBeneficiary).toHaveBeenCalledWith('0xmockBeneficiary');
      expect(mockMemberNftInstance.setIsTransferrable).toHaveBeenCalledWith(false);
    });
  });
});
