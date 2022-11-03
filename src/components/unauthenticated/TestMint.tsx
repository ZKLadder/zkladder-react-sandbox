import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function TestMint() {
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [dropData, setDropData] = useState({});
  const { dropId } = useParams();

  useEffect(() => {
    window.addEventListener('dropLoaded', (data:any) => {
      setDropData(data.detail.drop);
    });
    window.addEventListener('customError', (data:any) => {
      setSuccess(false);
      setError(data?.detail?.error);
    });
    window.addEventListener('mint', () => {
      setError(undefined);
      setSuccess(true);
    });
  }, []);

  useEffect(() => {
    if (window && document) {
      const script = document.createElement('script');
      script.src = 'https://embeds.zkladder.com';
      script.async = true;
      if (document.getElementById('anchor')) {
        document.body.appendChild(script);
      }
    }
  }, []);

  return (
    <Container fluid style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <Row className="pt-5">
        <Col lg={{ offset: 2, span: 4 }} className="mt-5 pt-5">
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>TEST MINT BY ZKLADDER</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non nulla mauris.
            Praesent hendrerit tellus ut ullamcorper pharetra. Ut at sapien sed metus semper
            facilisis.
            Nulla placerat augue ut lectus vehicula, quis dictum justo tristique. Duis sit amet
            lacus ultrices,
            posuere velit id, mattis libero. Donec commodo odio vitae nibh consectetur dignissim.
            Nulla porta lacinia magna at egestas. Suspendisse laoreet ex at consectetur molestie.
            Proin lacinia odio eu augue iaculis fermentum. Vestibulum laoreet ut velit id fermentum.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non nulla mauris.
            Praesent hendrerit tellus ut ullamcorper pharetra. Ut at sapien sed metus semper
            facilisis.
          </p>
          <Row className="mx-0 px-0 mt-5 py-4 px-4" style={{ backgroundColor: 'rgba(255, 255, 255, .15)', backdropFilter: 'blur(5px)', minHeight: '200px' }}>
            <Col lg={7}>
              Mint Price:
              {' '}
              {(dropData as any)?.salePrice?.toString() ? `${(dropData as any)?.salePrice} ETH` : null}
              {' '}

            </Col>
            <Col lg={5} />
            <Col lg={12} className="mt-5 pt-5">
              <div id="anchor" data-dropid={dropId} />
            </Col>
          </Row>
          {error ? <p>{error}</p> : null}
          {success ? <p>Mint Succeeded!</p> : null}
        </Col>
      </Row>
    </Container>
  );
}
