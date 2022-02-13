import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import {
  render, screen, waitFor, fireEvent, act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Attestation from '../../../components/onboarding/Attestation';
import { onboardingState } from '../../../state/onboarding';

global.URL.createObjectURL = jest.fn(() => ('mockData.png'));

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

describe('Attestation component tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot>
        <Attestation />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('UPLOAD YOUR TOKEN SEED')).toBeVisible();
      expect(screen.getByText('GENERATE PREVIEW')).toBeVisible();
      expect(screen.getByText('GENERATE PREVIEW')).toHaveAttribute('class', 'inactive-button btn btn-primary');
    });
  });

  test('Upload workflow', async () => {
    const onboardingStateObserver = jest.fn();
    render(
      <RecoilRoot>
        <RecoilObserver node={onboardingState} onChange={onboardingStateObserver} />
        <Attestation />
      </RecoilRoot>,
    );

    const fileInput = screen.getByTestId('dropzone');

    const mockFile = new File(['file'], 'mockData.png', {
      type: 'image/png',
    });

    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
    });

    act(() => { fireEvent.drop(fileInput); });

    const uploadButton = screen.getByText('GENERATE PREVIEW');

    await waitFor(() => {
      expect(uploadButton).toBeVisible();
      expect(screen.getByTestId('removeImage')).toBeVisible();
      expect(screen.getByTestId('imagePreview')).toHaveAttribute('alt', 'mockData.png');
    });

    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(onboardingStateObserver).toHaveBeenCalledWith({
        currentStep: 3,
        attestationHash: -996711432,
      });
    });
  });
});
