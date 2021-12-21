import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Zkl from '@zkladder/zkladder-sdk-ts';
import SelectContract from '../../../components/nft/SelectContract';

const mockNft = jest.fn();

jest.mock('@zkladder/zkladder-sdk-ts', () => (jest.fn()));

describe('Contract Metadata component tests', () => {
  const mockZkl = Zkl as jest.Mocked<any>;
  mockZkl.prototype.nft = mockNft;
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
    mockNft.mockResolvedValueOnce({});
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
      expect(mockNft).toHaveBeenCalledWith('0x123456789');
    });
  });

  test('Errors are displayed correctly', async () => {
    mockNft.mockRejectedValueOnce({ message: 'An error occured' });
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
      expect(mockNft).toHaveBeenCalledWith('0x123456789');
      expect(screen.getByText('An error occured')).toBeVisible();
    });
  });
});
