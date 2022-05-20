/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { Container, Button, Card } from 'react-bootstrap';
import { XCircleFill } from 'react-bootstrap-icons';
import { useDropzone } from 'react-dropzone';
import style from '../../styles/onboarding.module.css';
import sharedStyle from '../../styles/shared.module.css';
import { onboardingState } from '../../state/onboarding';
import Error from '../shared/Error';

import { hashString } from '../../utils/helpers';

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
    <Container className={sharedStyle['body-wrapper']}>
      {/* Title */}
      <p className={style.title}>
        UPLOAD YOUR TOKEN SEED
      </p>
      {/* Description */}
      <p className={style.description}>
        Your token seed is what will make your ZKL NFT 1 of a kind and will affect how your NFT generation looks.
        Ideally your token seed will be an image of something important to you, and can serve
        as a reminder as to what you want to accomplish by joining our community.
      </p>

      <div className={style['upload-wrapper']}>
        <p className={style.description}> UPLOAD HERE:</p>
        {acceptedFiles.length
          ? (
            <div style={{ display: 'flex' }}>
              {/* Image preview */}
              <img data-testid="imagePreview" alt={acceptedFiles[0].name} className={style['image-preview']} src={URL.createObjectURL(acceptedFiles[0])} />
              <XCircleFill
                data-testid="removeImage"
                className={style['cancel-icon']}
                size={36}
                onClick={async () => {
                  setAcceptedFiles([]);
                }}
              />
            </div>
          )
          : (
            <div data-testid="dropzone" {...getRootProps({ style: { height: '98%' } })}>
              {/* Image dropzone */}
              <Card className={style['file-upload']} />
              <input data-testid="fileInput" {...getInputProps()} />
            </div>
          )}
      </div>

      {/* Upload button */}
      <Button
        disabled={acceptedFiles.length < 1}
        className={`${acceptedFiles.length > 0 ? style['active-button'] : style['inactive-button']}`}
        onClick={async () => {
          try {
            const reader = new FileReader();
            reader.readAsDataURL(acceptedFiles[0]);
            reader.onload = () => {
              const dataUrl = reader.result as string;
              setOnboardingState({
                ...onboarding,
                currentStep: 3,
                // hash and store uploaded image dataUrl as seed value
                tokenSeed: hashString(dataUrl),
              });
            };
          } catch (err:any) {
            setError(err.message || 'Error uploading token seed. Please contact our tech team');
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
