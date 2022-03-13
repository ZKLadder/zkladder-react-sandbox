import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import '../../styles/ipfs.css';
import { useRecoilValue } from 'recoil';
import { loadingState } from '../../state/page';
import style from '../../styles/shared.module.css';

function LoadingModal() {
  const loading = useRecoilValue(loadingState);

  return (
    <Modal
      show={loading.loading}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
    >
      {/* Modal Header */}
      <Modal.Body style={{ justifyContent: 'center' }}>
        <Modal.Title className={style['loading-modal-header']}>
          {loading.header}
        </Modal.Title>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spinner style={{ color: '#16434B' }} animation="border" />
        </div>

        <br />
        <div className={style['loading-modal-content']}>{loading.content}</div>
      </Modal.Body>

    </Modal>
  );
}

export default LoadingModal;
