import React, { useEffect } from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SelectTemplate from '../../../components/deploy/SelectTemplate';
import { deployState } from '../../../state/deploy';

global.URL.createObjectURL = jest.fn(() => ('mockData.png'));

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

describe('ConfigureContract component tests', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    const deployStateObserver = jest.fn();
    render(
      <RecoilRoot>
        <MemoryRouter>
          <RecoilObserver node={deployState} onChange={deployStateObserver} />
          <SelectTemplate />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('SELECT A TEMPLATE')).toBeVisible();
      expect(screen.getByText('MEMBER NFT')).toBeVisible();
      expect(screen.getByText('GOVERNANCE TOKEN')).toBeVisible();
      expect(screen.getByText('ART COLLECTION')).toBeVisible();
      expect(screen.getByText('EVENT ADMISSION')).toBeVisible();
      expect(screen.getByText('DAO')).toBeVisible();
      expect(screen.getByText('CURRENCY')).toBeVisible();
    });
  });

  test('Selecting template correctly updates state', async () => {
    const deployStateObserver = jest.fn();
    render(
      <RecoilRoot>
        <MemoryRouter>
          <RecoilObserver node={deployState} onChange={deployStateObserver} />
          <SelectTemplate />
        </MemoryRouter>
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByText('MEMBER NFT'));

    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(
        expect.objectContaining({ currentStep: 2, selectedTemplate: 'MEMBER NFT' }),
      );
    });
  });
});
