import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import ConfigureDrop from '../../../../../components/manageProjects/memberNftV2/drops/ConfigureDrop';
import { currentDropState } from '../../../../../state/drop';
import { mockAccessValidatorInstance, mockMemberNftInstance } from '../../../../mocks';
import { contractsState, selectedContractState } from '../../../../../state/contract';
import { walletState } from '../../../../../state/wallet';
import {
  updateDrop, getDrops, updateAccessSchema, createAccessSchema,
} from '../../../../../utils/api';

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNftV2: {
    setup: () => (mockMemberNftInstance),
  },
  AccessValidator: jest.fn(),
}));

jest.mock('../../../../../utils/api', () => ({
  getDrops: jest.fn(),
  updateDrop: jest.fn(),
  updateAccessSchema: jest.fn(),
  createAccessSchema: jest.fn(),
}));

jest.mock('../../../../../components/accessSchemas/SchemaContainer', () => ({
  __esModule: true,
  default: ({ index }:{index:number}) => <p>{`SCHEMA CONDITION ${index}`}</p>,
}));

const contracts = [
  { address: '0xselectedContract', chainId: '1', templateId: '3' },
];

const initializeState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract', chainId: '1', templateId: '3' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(currentDropState, {
    id: 234, name: 'A NEW DROP', tierId: 0, accessSchema: { accessSchema: [] }, accessSchemaId: '212',
  });
};

const initializeNoIdState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract', chainId: '1', templateId: '3' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(), address: ['0xcreator'],
  });
  settings.set(currentDropState, {
    id: 234, name: 'A NEW DROP', tierId: 0, accessSchema: { accessSchema: [] },
  });
};

const initializeAccessRestrictionsState = (settings:any) => {
  settings.set(selectedContractState, { address: '0xselectedContract', chainId: '1', templateId: '3' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(currentDropState, {
    id: 234, name: 'A NEW DROP', tierId: 0, accessSchema: { accessSchema: [{ one: 'one' }, { two: 'two' }, { three: 'three' }] },
  });
};

const initializeEmptyState = (settings: any) => {
  settings.set(selectedContractState, { address: '0xselectedContract', chainId: '1', templateId: '3' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(currentDropState, {
    id: 234, name: '', tierId: 0,
  });
};

const mockUpdateDrop = updateDrop as jest.Mocked<any>;
const mockGetDrops = getDrops as jest.Mocked<any>;
const mockUpdateAccessSchema = updateAccessSchema as jest.Mocked<any>;
const mockCreateAccessSchema = createAccessSchema as jest.Mocked<any>;

describe('ConfigureDrop component tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});

    (AccessValidator as jest.Mocked<any>).mockImplementation(() => (mockAccessValidatorInstance));
  });

  test('It renders with no access restrictions', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
    mockAccessValidatorInstance.getAccessSchema.mockReturnValue([]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <ConfigureDrop />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MEMBERSHIP TIER')).toBeVisible();
      expect(screen.getByText('TEST TIER')).toBeVisible();
      expect(screen.getByText('DROP NAME (Optional)')).toBeVisible();
      expect(screen.getByText('DROP NAME (Optional)')).toBeVisible();
      expect(screen.getByText('MINTING OPENS')).toBeVisible();
      expect(screen.getByText('MINTING CLOSES')).toBeVisible();
      expect(screen.getByText('MINT RESTRICTIONS')).toBeVisible();
      expect(screen.getByText('No restrictions')).toBeVisible();
    });
  });

  test('It renders with access restrictions', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
    mockAccessValidatorInstance.getAccessSchema.mockReturnValue([{ one: 'one' }, { two: 'two' }, { three: 'three' }]);
    render(
      <RecoilRoot initializeState={initializeAccessRestrictionsState}>
        <ConfigureDrop />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MEMBERSHIP TIER')).toBeVisible();
      expect(screen.getByText('TEST TIER')).toBeVisible();
      expect(screen.getByText('DROP NAME (Optional)')).toBeVisible();
      expect(screen.getByText('DROP NAME (Optional)')).toBeVisible();
      expect(screen.getByText('MINTING OPENS')).toBeVisible();
      expect(screen.getByText('MINTING CLOSES')).toBeVisible();
      expect(screen.getByText('MINT RESTRICTIONS')).toBeVisible();
      expect(screen.getByText('SCHEMA CONDITION 0')).toBeVisible();
      expect(screen.getByText('SCHEMA CONDITION 1')).toBeVisible();
      expect(screen.getByText('SCHEMA CONDITION 2')).toBeVisible();
    });
  });

  test('Add requirements button correctly calls API', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
    mockAccessValidatorInstance.getAccessSchema.mockReturnValue([{ mock: 'schema' }]);
    mockGetDrops.mockResolvedValue([{ mock: 'drop' }]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <ConfigureDrop />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByText('ADD REQUIREMENT'));

    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await waitFor(() => {
      expect(mockUpdateAccessSchema).toHaveBeenCalledWith({
        id: '212',
        accessSchema: [{ mock: 'schema' }],
      });

      expect(mockGetDrops).toHaveBeenCalledWith({
        id: 234,
        contractAddress: '0xselectedContract',
        chainId: '1',
      });
    });
  });

  test('Set rule correctly calls API', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
    mockAccessValidatorInstance.getAccessSchema.mockReturnValue([{ one: 'one' }, { two: 'two' }, { three: 'three' }]);
    mockGetDrops.mockResolvedValue([{ mock: 'drop' }]);
    render(
      <RecoilRoot initializeState={initializeState}>
        <ConfigureDrop />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('toggleRule'));
    await userEvent.click(screen.getByText('Minter must meet all requirements'));

    await waitFor(() => {
      expect(mockAccessValidatorInstance.updateAccessCondition).toHaveBeenCalledWith({ index: 1, operator: 'and' });
    });

    await userEvent.click(screen.getByTestId('toggleRule'));
    await userEvent.click(screen.getByText('Minter must meet at least one requirement'));

    await waitFor(() => {
      expect(mockAccessValidatorInstance.updateAccessCondition).toHaveBeenCalledWith({ index: 1, operator: 'or' });
    });
  });

  test('Creates new accessSchema if one does not already exist', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
    mockAccessValidatorInstance.getAccessSchema.mockReturnValue([{ one: 'one' }, { two: 'two' }, { three: 'three' }]);
    mockCreateAccessSchema.mockResolvedValue({ id: '12345' });
    mockGetDrops.mockResolvedValue([{ mock: 'drop' }]);

    render(
      <RecoilRoot initializeState={initializeNoIdState}>
        <ConfigureDrop />
      </RecoilRoot>,
    );

    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await waitFor(() => {
      expect(mockCreateAccessSchema).toHaveBeenCalledWith({
        accessSchema: [{ one: 'one' }, { two: 'two' }, { three: 'three' }],
        creatorAddress: '0xcreator',
      });
    });
  });

  test('Editing drop correctly calls API', async () => {
    mockMemberNftInstance.getTiers.mockResolvedValueOnce([{ tierId: 0, name: 'TEST TIER' }, { tierId: 1, name: 'A SECOND TIER' }]);
    mockAccessValidatorInstance.getAccessSchema.mockReturnValue([]);
    mockGetDrops.mockResolvedValue([{ accessSchema: { accessSchema: [] } }]);
    mockCreateAccessSchema.mockResolvedValue({ id: 'mock' });

    render(
      <RecoilRoot initializeState={initializeEmptyState}>
        <ConfigureDrop />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByText('TEST TIER'));
    await userEvent.click(screen.getByText('A SECOND TIER'));
    await userEvent.type(screen.getByTestId('dropName'), 'New name');

    /* eslint-disable no-promise-executor-return */
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await waitFor(() => {
      expect(mockUpdateDrop).toHaveBeenCalledWith({
        id: 234,
        contractAddress: '0xselectedContract',
        chainId: '1',
        tierId: 1,
        name: 'New name',
        accessSchema: [],
      });

      expect(mockGetDrops).toHaveBeenCalledWith({
        id: 234,
        contractAddress: '0xselectedContract',
        chainId: '1',
      });
    });
  });
});
