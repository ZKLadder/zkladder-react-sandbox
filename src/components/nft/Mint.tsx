import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { nftState, viewState } from '../../state/nftContract';
import '../../styles/error.css';

function Mint() {
  const [nft, setNftState] = useRecoilState(nftState);
  const [loadingState, setLoadingState] = useState(false) as any;
  const [errorState, setErrorState] = useState() as any;
  const setViewState = useSetRecoilState(viewState);
  return (
    <div>
      <Button
        data-testid="mintButton"
        style={{ marginTop: '20px', marginRight: '20px' }}
        className="btn"
        onClick={async () => {
          try {
            setLoadingState(true);
            setErrorState(undefined);
            // await nft.instance?.mintAndWait();
            setLoadingState(false);
            setNftState({
              ...nft, refreshCounter: nft.refreshCounter + 1,
            });
          } catch (error:any) {
            setLoadingState(false);
            setErrorState(error.message || 'There was an error while minting');
          }
        }}
      >
        {' '}
        Mint a new token
        {' '}

      </Button>
      <Button
        data-testid="allTokensButton"
        style={{ marginTop: '20px', marginRight: '20px' }}
        className="btn"
        onClick={async () => {
          setViewState('allTokens');
        }}
      >
        {' '}
        View all tokens
        {' '}

      </Button>
      <Button
        data-testid="myTokensButton"
        style={{ marginTop: '20px' }}
        className="btn"
        onClick={async () => {
          setViewState('allMyTokens');
        }}
      >
        {' '}
        View all of my tokens
        {' '}

      </Button>
      <br />
      {errorState ? <p className="error">{errorState}</p> : undefined}
      {loadingState ? <Spinner style={{ margin: '20px' }} animation="border" role="status" /> : undefined}
    </div>
  );
}

export default Mint;
