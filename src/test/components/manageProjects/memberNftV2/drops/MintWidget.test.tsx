import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import MintWidget from '../../../../../components/manageProjects/memberNftV2/drops/MintWidget';
import { currentDropState } from '../../../../../state/drop';
import { mockMemberNftInstance } from '../../../../mocks';
import { contractsState, selectedContractState } from '../../../../../state/contract';
import { walletState } from '../../../../../state/wallet';

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

describe('ConfigureDrop component tests', () => {
  beforeEach(() => {
    // Silence react act warning
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders with no access restrictions', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <MintWidget />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('CODE SNIPPET')).toBeVisible();
      expect(screen.getByText('Embed the code snippet below into your application to enable minting')).toBeVisible();
      expect(screen.getByText('<div id="anchor" data-dropid="234" />')).toBeVisible();
      expect(screen.getByText('<script type="module" src="https://embeds.zkladder.com"></script>')).toBeVisible();
    });
  });
});
