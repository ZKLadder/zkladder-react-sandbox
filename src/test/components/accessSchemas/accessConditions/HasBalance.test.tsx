import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import HasBalance from '../../../../components/accessSchemas/accessConditions/hasBalance';
import { dropUpdatesState } from '../../../../state/drop';
import { mockAccessValidatorInstance, mockMemberNftInstance, RecoilObserver } from '../../../mocks';
import { contractsState, selectedContractState } from '../../../../state/contract';
import { walletState } from '../../../../state/wallet';

jest.mock('../../../../utils/api', () => ({
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
  utilities: {
    weiToEth: () => (11235),
  },
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
    accessSchema: [{ key: 'hasBalance', chainId: 31337, returnValueTest: { value: '1000000000000000000' } }],
  });
};

describe('HasBalance tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});

    (AccessValidator as jest.Mocked<any>).mockImplementation(() => (mockAccessValidatorInstance));
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <HasBalance index={0} />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('NETWORK')).toBeVisible();
      expect(screen.getByText('Hardhat')).toBeVisible();
      expect(screen.getByText('MINIMUM BALANCE')).toBeVisible();
      expect(screen.getByDisplayValue(11235)).toBeVisible();
    });
  });

  test('Updates workflow', async () => {
    const updatesObserver = jest.fn();
    mockAccessValidatorInstance.getAccessSchema.mockReturnValueOnce({ mock: 'one' });
    mockAccessValidatorInstance.getAccessSchema.mockReturnValueOnce({ mock: 'two' });

    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={dropUpdatesState} onChange={updatesObserver} />
        <HasBalance index={0} />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('toggleNetwork'));
    await userEvent.click(screen.getByText('Polygon'));

    await waitFor(() => {
      expect(mockAccessValidatorInstance.updateAccessCondition).toHaveBeenCalledWith({ index: 0, chainId: 137 });
      expect(updatesObserver).toHaveBeenCalledWith({ accessSchema: { mock: 'one' } });
    });

    await userEvent.type(screen.getByTestId('minBalance'), '1');

    await waitFor(() => {
      expect(mockAccessValidatorInstance.updateAccessCondition).toHaveBeenCalledWith({ index: 0, minBalance: 112351 });
      expect(updatesObserver).toHaveBeenCalledWith({ accessSchema: { mock: 'two' } });
    });
  });
});
