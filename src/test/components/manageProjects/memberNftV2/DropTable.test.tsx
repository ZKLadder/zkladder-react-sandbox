import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropTable from '../../../../components/manageProjects/memberNftV2/DropTable';
import { dropSectionState } from '../../../../state/page';
import { RecoilObserver } from '../../../mocks';

describe('DropTable component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot>
        <DropTable />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('SCHEDULE A NEW DROP')).toBeVisible();
      expect(screen.getByText('MINT A SINGLE NFT')).toBeVisible();
      expect(screen.getByText('No drops created yet')).toBeVisible();
    });
  });

  test('Mint button correctly updates state', async () => {
    const dropSectionObserver = jest.fn();
    render(
      <RecoilRoot>
        <RecoilObserver node={dropSectionState} onChange={dropSectionObserver} />
        <DropTable />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByText('MINT A SINGLE NFT'));

    await waitFor(() => {
      expect(dropSectionObserver).toHaveBeenCalledWith('airDrop');
    });
  });
});
