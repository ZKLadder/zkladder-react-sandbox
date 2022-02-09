/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { Container, Button, Card } from 'react-bootstrap';
import '../../styles/onboarding.css';
import { XCircleFill } from 'react-bootstrap-icons';
import { useDropzone } from 'react-dropzone';
import { onboardingState } from '../../state/onboarding';
import Error from '../shared/Error';

import { hashString } from '../../utils/address';

function Attestation() {
  const [error, setError] = useState() as any;
  const [onboarding, setOnboardingState] = useRecoilState(onboardingState);
  const [acceptedFiles, setAcceptedFiles] = useState([]) as any;

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (files) => {
      setAcceptedFiles(files);
    },
  });

  return (
    <Container style={{ paddingLeft: '25px', paddingTop: '60px' }}>
      <p className="title">
        UPLOAD YOUR TOKEN SEED
      </p>
      <p className="description">
        Your token seed is what will make your ZKL NFT 1 of a kind and will affect how your NFT generation looks.
        Ideally your token seed will be an image of something important to you, and can serve
        as a reminder as to what you want to accomplish by joining our community.
      </p>

      <div className="upload-wrapper">
        <p className="description"> UPLOAD HERE:</p>
        {acceptedFiles.length
          ? (
            <div style={{ display: 'flex', height: '320px' }}>
              <img data-testid="imagePreview" alt={acceptedFiles[0].name} className="image-preview" src={URL.createObjectURL(acceptedFiles[0])} />
              <XCircleFill
                data-testid="removeImage"
                className="cancel-icon"
                size={36}
                onClick={async () => {
                  setAcceptedFiles([]);
                }}
              />
            </div>
          )
          : (
            <div data-testid="dropzone" {...getRootProps({ style: { height: '40vh' } })}>
              <Card className="file-upload" />
              <input data-testid="fileInput" {...getInputProps()} />

            </div>
          )}
      </div>

      <Button
        disabled={acceptedFiles.length < 1}
        className={`${acceptedFiles.length > 0 ? 'active-button' : 'inactive-button'}`}
        onClick={async () => {
          try {
            const reader = new FileReader();
            reader.readAsDataURL(acceptedFiles[0]);
            reader.onload = () => {
              const dataUrl = reader.result as string;
              setOnboardingState({
                ...onboarding,
                currentStep: 3,
                attestationHash: hashString(dataUrl),
              });
            };
          } catch (err:any) {
            setError(err.message || 'Error uploading attestation. Please contact our tech team');
          }
        }}
      >
        GENERATE PREVIEW
      </Button>
      {error ? (<Error text={error} />) : null}

    </Container>
  );
}

export default Attestation;
