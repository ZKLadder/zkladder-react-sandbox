import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import Drops from '../../../../components/manageProjects/memberNftV2/Drops';
import { dropSectionState } from '../../../../state/page';

jest.mock('../../../../components/manageProjects/memberNftV2/AirDrop', () => ({
  __esModule: true,
  default: () => <p>AIRDROP COMPONENT</p>,
}));

jest.mock('../../../../components/manageProjects/memberNftV2/DropTable', () => ({
  __esModule: true,
  default: () => <p>DROP TABLE COMPONENT</p>,
}));

const initializeState = (settings: any) => {
  settings.set(dropSectionState, 'airDrop');
};

describe('Drops component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot>
        <Drops />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Active Drops')).toBeVisible();
      expect(screen.getByText('Upcoming Drops')).toBeVisible();
      expect(screen.getByText('DROP TABLE COMPONENT')).toBeVisible();
    });
  });

  test('It renders when airdrop is the selected section', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Drops />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Active Drops')).toBeVisible();
      expect(screen.getByText('Upcoming Drops')).toBeVisible();
      expect(screen.getByText('AIRDROP COMPONENT')).toBeVisible();
    });
  });
});
