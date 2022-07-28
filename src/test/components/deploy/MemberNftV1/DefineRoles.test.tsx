import React, { useEffect } from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import userEvent from '@testing-library/user-event';
import DefineRoles from '../../../../components/deploy/memberNftV1/DefineRoles';
import { deployState } from '../../../../state/deploy';
import { walletState } from '../../../../state/wallet';

const initializeState = (settings:any) => {
  settings.set(deployState, {
    currentStep: 3,
    roles: [
      {
        name: 'Test Role', description: 'Test Description', id: 'Test Id', price: 100,
      },
    ],
  });
  settings.set(walletState, {
    chainId: 4,
  });
};

const initializeWalletState = (settings:any) => {
  settings.set(walletState, {
    chainId: 4,
  });
};

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

describe('DefineRoles component tests', () => {
  beforeEach(() => {
    // Silence jest act() errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <DefineRoles />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('DEFINE COMMUNITY ROLES')).toBeVisible();
      expect(screen.getByText('ROLE NAME')).toBeVisible();
      expect(screen.getByDisplayValue('Test Role')).toBeVisible();
      expect(screen.getByText('ROLE ID')).toBeVisible();
      expect(screen.getByDisplayValue('Test Id')).toBeVisible();
      expect(screen.getByText('ROLE DESCRIPTION')).toBeVisible();
      expect(screen.getByDisplayValue('Test Description')).toBeVisible();
      expect(screen.getByText('MINT PRICE (RIN)')).toBeVisible();
      expect(screen.getByDisplayValue('100')).toBeVisible();
    });
  });

  test.skip('Setting fields correctly updates state', async () => {
    const deployStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeWalletState}>
        <RecoilObserver node={deployState} onChange={deployStateObserver} />
        <DefineRoles />
      </RecoilRoot>,
    );

    userEvent.type(screen.getByTestId('id'), 'A ROLE ID');
    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        roles: [
          {
            name: '', id: 'A ROLE ID', description: '', price: 0,
          },
        ],
      }));
    });

    userEvent.type(screen.getByTestId('name'), 'A ROLE NAME');
    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        roles: [
          {
            name: 'A ROLE NAME', id: 'A ROLE ID', description: '', price: 0,
          },
        ],
      }));
    });

    userEvent.type(screen.getByTestId('description'), 'A ROLE DESCRIPTION');
    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        roles: [
          {
            name: 'A ROLE NAME', id: 'A ROLE ID', description: 'A ROLE DESCRIPTION', price: 0,
          },
        ],
      }));
    });

    userEvent.type(screen.getByTestId('price'), '1.5');
    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        roles: [
          {
            name: 'A ROLE NAME', id: 'A ROLE ID', description: 'A ROLE DESCRIPTION', price: 1.5,
          },
        ],
      }));
    });

    userEvent.click(screen.getByTestId('addRole'));
    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        roles: [
          {
            name: 'A ROLE NAME', id: 'A ROLE ID', description: 'A ROLE DESCRIPTION', price: 1.5,
          },
          {
            name: '', id: '', description: '', price: 0,
          },
        ],
      }));
    });

    userEvent.click(screen.getByTestId('continue'));
    await waitFor(() => {
      expect(screen.getByText('Role #2 is missing a name')).toBeVisible();
    });

    userEvent.click(screen.getByText('Unnamed Role'));

    userEvent.type(screen.getByTestId('name'), 'ROLE NAME 2');

    userEvent.click(screen.getByTestId('continue'));

    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        currentStep: 4,
      }));
    });
  });

  test('Back button correctly updates state', async () => {
    const deployStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeWalletState}>
        <RecoilObserver node={deployState} onChange={deployStateObserver} />
        <DefineRoles />
      </RecoilRoot>,
    );

    userEvent.click(screen.getByText('RETURN TO CONTRACT CONFIGURATION'));

    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        currentStep: 2,
      }));
    });
  });
});
