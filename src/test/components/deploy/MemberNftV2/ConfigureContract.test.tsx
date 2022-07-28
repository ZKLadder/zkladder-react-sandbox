import React, { useEffect } from 'react';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import userEvent from '@testing-library/user-event';
import ConfigureContract from '../../../../components/deploy/memberNftV2/ConfigureContract';
import { deployState } from '../../../../state/deploy';

const initializeState = (settings:any) => {
  settings.set(deployState, {
    currentStep: 2,
    config: {
      name: 'ZKL test',
      symbol: 'ZKLT',
      description: 'The best mock NFT project',
      external_link: 'https://mock.com',
      beneficiaryAddress: '0xuser',
    },
  });
};

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

  test('It renders with default values from stat', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <ConfigureContract />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('SET UP YOUR CONTRACT')).toBeVisible();
      expect(screen.getByText('COMMUNITY NAME')).toBeVisible();
      expect(screen.getByDisplayValue('ZKL test')).toBeVisible();
      expect(screen.getByText('CONTRACT SYMBOL')).toBeVisible();
      expect(screen.getByDisplayValue('ZKLT')).toBeVisible();
      expect(screen.getByText('COMMUNITY WEB URL')).toBeVisible();
      expect(screen.getByTestId('externalLink')).toHaveValue('https://mock.com');
      expect(screen.getByText('COMMUNITY DESCRIPTION')).toBeVisible();
      expect(screen.getByText('The best mock NFT project')).toBeVisible();
      expect(screen.getByText('BENEFICIARY ADDRESS')).toBeVisible();
      expect(screen.getByDisplayValue('0xuser')).toBeVisible();
      expect(screen.getByText('COLLECTION IMAGE')).toBeVisible();
    });
  });

  test('Submit workflow', async () => {
    const deployStateObserver = jest.fn();
    render(
      <RecoilRoot>
        <RecoilObserver node={deployState} onChange={deployStateObserver} />
        <ConfigureContract />
      </RecoilRoot>,
    );

    await userEvent.type(screen.getByTestId('name'), 'Mock Name');
    await userEvent.type(screen.getByTestId('symbol'), 'Mock Symbol');
    await userEvent.type(screen.getByTestId('description'), 'Mock Description');
    await userEvent.type(screen.getByTestId('externalLink'), 'https://mockventure.org');
    await userEvent.type(screen.getByTestId('beneficiaryAddress'), 'Mock Beneficiary');

    const imageUpload = screen.getByTestId('image');
    const mockImage = new File(['image'], 'mockData.png', {
      type: 'image/png',
    });
    Object.defineProperty(imageUpload, 'files', {
      value: [mockImage],
    });
    await fireEvent.drop(imageUpload);

    await userEvent.click(screen.getByTestId('continueButton'));

    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        currentStep: 3,
        config: {
          name: 'Mock Name',
          symbol: 'Mock Symbol',
          description: 'Mock Description',
          beneficiaryAddress: 'Mock Beneficiary',
          external_link: 'https://mockventure.org',
          image: mockImage,
        },
      }));
    }, { timeout: 2000 });
  });

  test('Missing fields and invalid URL workflow', async () => {
    const deployStateObserver = jest.fn();
    render(
      <RecoilRoot>
        <RecoilObserver node={deployState} onChange={deployStateObserver} />
        <ConfigureContract />
      </RecoilRoot>,
    );

    await userEvent.type(screen.getByTestId('externalLink'), 'not a url');

    await userEvent.click(screen.getByTestId('continueButton'));

    await waitFor(() => {
      expect(screen.getByTestId('name')).toHaveAttribute('class', 'form-input form-control is-invalid');
      expect(screen.getByTestId('symbol')).toHaveAttribute('class', 'form-input form-control is-invalid');
      expect(screen.getByTestId('beneficiaryAddress')).toHaveAttribute('class', 'form-input form-control is-invalid');
      expect(screen.getByTestId('externalLink')).toHaveAttribute('class', 'form-input form-control is-invalid');
      expect(deployStateObserver).not.toHaveBeenCalledWith(expect.objectContaining({
        currentStep: 3,
      }));
    });
  });

  test('Go back workflow', async () => {
    const deployStateObserver = jest.fn();
    render(
      <RecoilRoot initializeState={initializeState}>
        <RecoilObserver node={deployState} onChange={deployStateObserver} />
        <ConfigureContract />
      </RecoilRoot>,
    );

    await userEvent.click(screen.getByTestId('returnButton'));

    await waitFor(() => {
      expect(deployStateObserver).toHaveBeenCalledWith(expect.objectContaining({
        currentStep: 1,
        config: {
          name: '',
          symbol: '',
          description: '',
          external_link: '',
          beneficiaryAddress: '',
          image: undefined,
        },
      }));
    });
  });
});
