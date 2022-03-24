import React, { useState } from 'react';
import {
  Card, Button, Container, Image,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import style from '../../styles/login.module.css';
import { connect, apiSession } from '../../utils/walletConnect';
import { walletState } from '../../state/wallet';
import logo from '../../images/zk_logo.png';
import Loading from '../shared/Loading';
import Error from '../shared/Error';

function Login() {
  const [wallet, setWalletState] = useRecoilState(walletState) as any;
  const [errorState, setErrorState] = useState() as any;
  const [loading, setLoading] = useState({
    connectingWallet: false,
    requestingSignature: false,
  }) as any;
  return (
    <Container className="d-flex vh-100">
      <Card className={`mx-auto m-auto align-self-center ${style['login-card']}`}>

        {/* ZKL logo */}
        <Image data-testid="logo" fluid className={style['login-logo']} src={logo} />

        {/* Connect wallet button */}
        <Button
          className={`${style['login-cardText']} mx-auto`}
          data-testid="connectButton"
          onClick={async () => {
            setErrorState(false);

            try {
              // Timeout to prevent 'Awaiting connection to wallet' from flashing if metamask already connected
              const timeoutId = setTimeout(() => {
                setLoading({ connectingWallet: true });
              }, 500);

              const {
                address, balance, provider, chainId,
              } = await connect();

              clearTimeout(timeoutId);

              setLoading({ requestingSignature: true });

              const { memberToken } = await apiSession(provider, address);

              setWalletState({
                address, balance, provider, chainId, isConnected: true, isMember: true, memberToken,
              });
            } catch (error:any) {
              setLoading({});
              setErrorState(error.message);
            }
          }}
          variant="outline-success"
        >
          Connect Wallet
        </Button>

        {/* Loading and error indicators */ }
        {loading.connectingWallet ? (<Loading text="Awaiting connection to wallet ..." />) : null}
        {loading.requestingSignature ? (<Loading text="Awaiting confirmation of signature ..." />) : null}
        {(errorState || wallet.reason) ? <Error text={errorState || wallet.reason || 'It appears your account does not have access'} /> : null}
      </Card>
    </Container>
  );
}

export default Login;
