import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Zkl from '@zkladder/zkladder-sdk-ts';
import SelectContract from '../../../components/nft/SelectContract';
import { walletState } from '../../../state/wallet';

const mockNftWhitelisted = jest.fn();

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));

describe('Select Contract component tests', () => {
  const mockZkl = Zkl as jest.Mocked<any>;
  mockZkl.nftWhitelisted = mockNftWhitelisted;

  const mockZklState = (settings:any) => {
    settings.set(walletState, {
      zkLadder: mockZkl,
    });
  };

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={mockZklState}>
        <SelectContract />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Enter an NFT contract address to get started')).toBeVisible();
      expect(screen.getByText('Enter')).toBeVisible();
    });
  });

  test('Clicking connect calls the nft service', async () => {
    mockNftWhitelisted.mockResolvedValueOnce({});
    render(
      <RecoilRoot initializeState={mockZklState}>
        <SelectContract />
      </RecoilRoot>,
    );

    const addressForm = screen.getByTestId('addressForm');
    const selectButton = screen.getByTestId('selectButton');

    await userEvent.type(addressForm, '0x123456789');
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(mockNftWhitelisted).toHaveBeenCalledWith('0x123456789');
    });
  });

  test('Errors are displayed correctly', async () => {
    mockNftWhitelisted.mockRejectedValueOnce({ message: 'An error occured' });
    render(
      <RecoilRoot initializeState={mockZklState}>
        <SelectContract />
      </RecoilRoot>,
    );

    const addressForm = screen.getByTestId('addressForm');
    const selectButton = screen.getByTestId('selectButton');

    await userEvent.type(addressForm, '0x123456789');
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(mockNftWhitelisted).toHaveBeenCalledWith('0x123456789');
      expect(screen.getByText('An error occured')).toBeVisible();
    });
  });
});
