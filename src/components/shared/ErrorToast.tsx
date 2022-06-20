import React from 'react';
import { useRecoilState } from 'recoil';
import { Toast } from 'react-bootstrap';
import { ExclamationTriangle } from 'react-bootstrap-icons';
import { errorState } from '../../state/page';
import sharedStyle from '../../styles/shared.module.css';

function ErrorToast() {
  const [error, setError] = useRecoilState(errorState);

  const closeModal = () => {
    setError({
      showError: false,
    });
  };

  return (
    <Toast className={sharedStyle['error-toast']} show={error.showError} onClose={closeModal} autohide delay={3500}>
      {error.showError
        ? (
          <Toast.Body>
            <ExclamationTriangle size={20} style={{ margin: '0px 5px 4px 5px' }} />
            {error.content}
          </Toast.Body>
        )
        : null}
    </Toast>
  );
}

export default ErrorToast;
