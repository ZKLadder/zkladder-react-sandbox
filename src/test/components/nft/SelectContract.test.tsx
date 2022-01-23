import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemberNft } from '@zkladder/zkladder-sdk-ts';
import SelectContract from '../../../components/nft/SelectContract';

// import { walletState } from '../../../state/wallet';

// const mockNftWhitelisted = jest.fn();

jest.mock('../../../config', () => ({
  ipfs: {
    projectId: 'mockProjectId',
    projectSecret: 'mockProjectSecret',
  },
}));

jest.mock('@zkladder/zkladder-sdk-ts', () => ({ MemberNft: { setup: jest.fn() } }));

const mockMemberNft = MemberNft as jest.Mocked<any>;

describe('Select Contract component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot>
        <SelectContract />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Enter an NFT contract address to get started')).toBeVisible();
      expect(screen.getByText('Enter')).toBeVisible();
    });
  });

  test('Clicking connect calls the nft service', async () => {
    mockMemberNft.setup.mockResolvedValueOnce({});
    render(
      <RecoilRoot>
        <SelectContract />
      </RecoilRoot>,
    );

    const addressForm = screen.getByTestId('addressForm');
    const selectButton = screen.getByTestId('selectButton');

    await userEvent.type(addressForm, '0x123456789');
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(mockMemberNft.setup).toHaveBeenCalledWith({
        infuraIpfsProjectId: 'mockProjectId',
        infuraIpfsProjectSecret: 'mockProjectSecret',
        address: '0x123456789',
        provider: undefined,
      });
    });
  });

  test('Errors are displayed correctly', async () => {
    mockMemberNft.setup.mockRejectedValueOnce({ message: 'An error occured' });
    render(
      <RecoilRoot>
        <SelectContract />
      </RecoilRoot>,
    );

    const addressForm = screen.getByTestId('addressForm');
    const selectButton = screen.getByTestId('selectButton');

    await userEvent.type(addressForm, '0x123456789');
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(mockMemberNft.setup).toHaveBeenCalledWith({
        infuraIpfsProjectId: 'mockProjectId',
        infuraIpfsProjectSecret: 'mockProjectSecret',
        address: '0x123456789',
        provider: undefined,
      });
      expect(screen.getByText('An error occured')).toBeVisible();
    });
  });
});
