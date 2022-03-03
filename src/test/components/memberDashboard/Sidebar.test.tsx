import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import Sidebar from '../../../components/memberDashboard/Sidebar';
import { walletState } from '../../../state/wallet';
import config from '../../../config';

jest.mock('react-bootstrap-icons', () => ({
  Gear: () => <p>GEAR</p>,
  Discord: () => <p>DISCORD</p>,
  Twitter: () => <p>TWITTER</p>,
  Linkedin: () => <p>LINKEDIN</p>,
  Telegram: () => <p>TELEGRAM</p>,
}));

jest.mock('../../../components/shared/P5Sketch', () => ({
  __esModule: true,
  default: () => <p>P5SKETCH</p>,
}));

Object.defineProperty(window, 'fetch', {
  configurable: true,
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'Function', {
  configurable: true,
  writable: true,
  value: jest.fn(),
});

const initializeState = (settings:any) => {
  settings.set(walletState, {
    isConnected: true,
    isMember: true,
    address: ['0xmockaddresstest'],
    memberToken: {
      tokenId: 123,
      totalSupply: 100,
      metadata: {
        attestation_hash: 'testhash',
      },
    },
  });
};

describe('Member dashboard sidebar tests', () => {
  test('It renders', async () => {
    (fetch as jest.Mocked<any>).mockResolvedValueOnce({
      text: () => ('Here is a test function'),
    });

    (Function as jest.Mocked<any>).mockReturnValueOnce(() => ('A executed function'));

    render(
      <RecoilRoot initializeState={initializeState}>
        <Sidebar />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('NFT Holder: 0xmock...test')).toBeVisible();
      expect(screen.getByText('MEMBER #123')).toBeVisible();
      expect(screen.getByText('P5SKETCH')).toBeVisible();

      // @TODO Add test case for other metrics when implemented
      expect(screen.getByTestId('memberCount')).toHaveTextContent('100');

      expect(screen.getByText('ZKL Member Profile Settings')).toBeVisible();
      expect(screen.getByText('DISCORD')).toBeVisible();
      expect(screen.getByText('TWITTER')).toBeVisible();
      expect(screen.getByText('LINKEDIN')).toBeVisible();
      expect(screen.getByText('TELEGRAM')).toBeVisible();

      expect((fetch as jest.Mocked<any>)).toHaveBeenCalledWith(config.zkl.memberSketchCid);
      expect((Function as jest.Mocked<any>)).toHaveBeenCalledWith('Here is a test function');
    });
  });
});
