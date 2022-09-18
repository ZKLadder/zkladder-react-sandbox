import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import SchemaContainer from '../../../components/accessSchemas/SchemaContainer';
import { dropUpdatesState } from '../../../state/drop';
import { mockAccessValidatorInstance, mockMemberNftInstance, RecoilObserver } from '../../mocks';
import { contractsState, selectedContractState } from '../../../state/contract';
import { walletState } from '../../../state/wallet';

jest.mock('../../../components/accessSchemas/accessConditions/hasBalance', () => ({
  __esModule: true,
  default: () => <p>HAS BALANCE</p>,
}));

jest.mock('../../../components/accessSchemas/accessConditions/hasBalanceERC20', () => ({
  __esModule: true,
  default: () => <p>HAS BALANCE ERC20</p>,
}));

jest.mock('../../../components/accessSchemas/accessConditions/hasERC721', () => ({
  __esModule: true,
  default: () => <p>HAS ERC721</p>,
}));

jest.mock('../../../components/accessSchemas/accessConditions/hasERC1155', () => ({
  __esModule: true,
  default: () => <p>HAS ERC1155</p>,
}));

jest.mock('../../../components/accessSchemas/accessConditions/isWhitelisted', () => ({
  __esModule: true,
  default: () => <p>IS WHITELISTED</p>,
}));

jest.mock('../../../components/accessSchemas/accessConditions/isBlacklisted', () => ({
  __esModule: true,
  default: () => <p>IS BLACKLISTED</p>,
}));

jest.mock('../../../utils/api', () => ({
  getDrops: jest.fn(),
  updateDrop: jest.fn(),
  updateAccessSchema: jest.fn(),
  createAccessSchema: jest.fn(),
}));

jest.mock('@zkladder/zkladder-sdk-ts', () => ({
  Ipfs: jest.fn(() => ({ getGatewayUrl: jest.fn() })),
  MemberNftV2: {
    setup: () => (mockMemberNftInstance),
  },
  AccessValidator: jest.fn(),
}));

const contracts = [
  { address: '0xselectedContract', chainId: '1', templateId: '3' },
];

const initializeState = (settings:any) => {
  settings.set(selectedContractState, { address: '0xselectedContract', chainId: '1', templateId: '3' });
  settings.set(contractsState, contracts);
  settings.set(walletState, {
    chainId: '1', provider: jest.fn(),
  });
  settings.set(dropUpdatesState, {
    accessSchema: [{ key: 'hasBalance' }],
  });
};

describe('SchemaContainer tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});

    (AccessValidator as jest.Mocked<any>).mockImplementation(() => (mockAccessValidatorInstance));
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <SchemaContainer index={0} />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('HAS BALANCE')).toBeVisible();
    });

    await userEvent.click(screen.getByTestId('toggleType'));
    await userEvent.click(screen.getByText('Require minimum balance of an ERC20 token'));
    await waitFor(() => {
      expect(screen.queryByText('HAS BALANCE')).not.toBeInTheDocument();
      expect(screen.getByText('HAS BALANCE ERC20')).toBeVisible();
    });

    await userEvent.click(screen.getByTestId('toggleType'));
    await userEvent.click(screen.getByText('Require ownership of an ERC721 NFT'));
    await waitFor(() => {
      expect(screen.queryByText('HAS BALANCE ERC20')).not.toBeInTheDocument();
      expect(screen.getByText('HAS ERC721')).toBeVisible();
    });

    await userEvent.click(screen.getByTestId('toggleType'));
    await userEvent.click(screen.getByText('Require ownership of an ERC1155 token'));
    await waitFor(() => {
      expect(screen.queryByText('HAS ERC721')).not.toBeInTheDocument();
      expect(screen.getByText('HAS ERC1155')).toBeVisible();
    });

    await userEvent.click(screen.getByTestId('toggleType'));
    await userEvent.click(screen.getByText('Add single address to whitelist'));
    await waitFor(() => {
      expect(screen.queryByText('HAS ERC1155')).not.toBeInTheDocument();
      expect(screen.getByText('IS WHITELISTED')).toBeVisible();
    });

    await userEvent.click(screen.getByTestId('toggleType'));
    await userEvent.click(screen.getByText('Add single address to blacklist'));
    await waitFor(() => {
      expect(screen.queryByText('IS WHITELISTED')).not.toBeInTheDocument();
      expect(screen.getByText('IS BLACKLISTED')).toBeVisible();
    });
  });

  test('Deletes access condition', async () => {
    mockAccessValidatorInstance.getAccessSchema.mockReturnValue({ mock: 'schema' });
    const dropUpdatesObserver = jest.fn();

    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={dropUpdatesState} onChange={dropUpdatesObserver} />
        <SchemaContainer index={0} />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('deleteCondition'));

    await waitFor(() => {
      expect(mockAccessValidatorInstance.deleteAccessCondition).toHaveBeenCalledWith(0);
      expect(dropUpdatesObserver).toHaveBeenCalledWith({ accessSchema: { mock: 'schema' } });
    });
  });
});
