import React, { useState } from 'react';
import {
  Form, Button, ListGroup, Spinner,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { nftState, nftContractMetadataState } from '../../state/nftContract';
import { walletState } from '../../state/wallet';
import errorStyle from '../../styles/error';
import nftStyle from '../../styles/nft';

function TokenQuery() {
  const { instance: nftInstance } = useRecoilValue(nftState);
  const { address: currentAddress } = useRecoilValue(walletState);
  const { totalSupply } = useRecoilValue(nftContractMetadataState);
  const [tokenId, setTokenId] = useState() as any;
  const [tokenData, setTokenData] = useState({}) as any;
  const [errorState, setErrorState] = useState({}) as any;
  const [loadingState, setLoadingState] = useState({}) as any;
  const [transferAddress, setTransferAddress] = useState() as any;
  return (
    <div>
      <p><Form.Label>{`Total Minted Supply: ${totalSupply}`}</Form.Label></p>
      {/* Token Data Section */}
      <Form.Control
        onChange={(event) => { setTokenId(parseInt(event.target.value, 10)); }}
        type="text"
        style={{ width: '60%' }}
        placeholder="Enter a token ID"
      />
      <Button
        style={{ marginTop: '20px' }}
        className="btn"
        onClick={async () => {
          try {
            setLoadingState({ dataLoading: true });
            setErrorState({});
            setTokenData({});
            const tokenUri: string = await nftInstance.tokenUri(tokenId);
            const tokenOwner: string = await nftInstance.ownerOf(tokenId);
            const approved: string = await nftInstance.getApproved(tokenId);
            setLoadingState(false);
            setTokenData({
              tokenOwner, tokenUri, approved,
            });
          } catch (error:any) {
            setLoadingState({ dataLoading: false });
            setErrorState({ dataError: 'There was an issue fetching this token data or this tokenId does not exist' });
          }
        }}
      >
        {' '}
        Get Token Data
        {' '}

      </Button>
      <br />
      {loadingState.dataLoading ? <Spinner style={{ margin: '20px' }} animation="border" role="status" /> : undefined}
      {errorState.dataError ? <p style={errorStyle}>{errorState.loadingError}</p> : undefined}
      {tokenData.tokenUri
        ? (
          <div>
            <br />
            <ListGroup horizontal="lg" className="list-inline" style={{ maxWidth: '100%' }}>
              <ListGroup.Item style={nftStyle.tokenInfo}>{`Token URI : ${tokenData.tokenUri}`}</ListGroup.Item>
              <ListGroup.Item style={nftStyle.tokenInfo}>{`Owned by : ${tokenData.tokenOwner}`}</ListGroup.Item>
              <ListGroup.Item style={nftStyle.tokenInfo}>{`Approved operator : ${tokenData.approved}`}</ListGroup.Item>
            </ListGroup>

            {/* Transfer token section */}
            <br />
            {loadingState.transferLoading ? <Spinner style={{ margin: '20px' }} animation="border" role="status" /> : undefined}
            {errorState.transferError ? <p style={errorStyle}>{errorState.transferError}</p> : undefined}
            <Form.Control
              onChange={(event) => { setTransferAddress(event.target.value); }}
              type="text"
              style={{ width: '60%', marginTop: '20px' }}
              placeholder="Enter another user's ETH address for transfer"
            />
            <Button
              style={{ marginTop: '20px' }}
              className="btn"
              onClick={async () => {
                try {
                  setLoadingState({ transferLoading: true });
                  setErrorState({});
                  if (tokenData.tokenOwner.toLowerCase() !== currentAddress?.[0]?.toLowerCase()
                  && tokenData.approved.toLowerCase() !== currentAddress?.[0]?.toLowerCase()) {
                    throw new Error('You are not the owner and are not approved to move this token');
                  }
                  await nftInstance.safeTransferFromAndWait(tokenData.tokenOwner, transferAddress, tokenId);
                  setLoadingState({ transferLoading: false });
                  setTokenData({
                    ...tokenData, tokenOwner: transferAddress,
                  });
                } catch (error:any) {
                  setLoadingState({ transferLoading: false });
                  setErrorState({ transferError: error.message || 'There was an error while transfering this token' });
                }
              }}
            >
              {' '}
              Transfer this token
              {' '}

            </Button>
          </div>

        ) : undefined}
    </div>

  );
}

export default TokenQuery;