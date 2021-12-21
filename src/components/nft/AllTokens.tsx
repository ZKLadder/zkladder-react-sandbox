import React, { useState, useEffect } from 'react';
import {
  Card, ListGroup, Spinner, Button,
} from 'react-bootstrap';
import { useRecoilState, useRecoilValue } from 'recoil';
import { nftState, viewState } from '../../state/nftContract';
import { walletState } from '../../state/wallet';
import errorStyle from '../../styles/error';
import nftStyle from '../../styles/nft';

function AllTokens() {
  const { instance } = useRecoilValue(nftState) as any;
  const { address } = useRecoilValue(walletState) as any;
  const [view, setViewState] = useRecoilState(viewState) as any;
  const [data, setDataState] = useState([]) as any;
  const [loadingState, setLoadingState] = useState(false);
  const [errorState, setErrorState] = useState();
  const [rows, setRows] = useState() as any;

  const getAllTokens = async () => {
    try {
      const allTokens = await instance.getAllTokens();
      setLoadingState(false);
      setDataState(allTokens);
    } catch (error: any) {
      setLoadingState(false);
      setErrorState(error.message || 'Error fetching token data');
    }
  };

  const getAllMyTokens = async () => {
    try {
      const allMyTokens = await instance.getAllTokensOwnedBy(address[0]);
      setLoadingState(false);
      setDataState(allMyTokens);
    } catch (error:any) {
      setLoadingState(false);
      setErrorState(error.message || 'Error fetching token data');
    }
  };

  const renderCard = (index:number) => (data[index]
    ? (
      <Card style={nftStyle.tokenCard}>
        <Card.Title>{`TokenID: ${data[index]?.tokenId}`}</Card.Title>
        <ListGroup horizontal="lg" className="list-inline" style={{ maxWidth: '100%' }}>
          <ListGroup.Item style={nftStyle.tokenListItem}>{`Token URI : ${data[index]?.tokenUri}`}</ListGroup.Item>
          <ListGroup.Item style={nftStyle.tokenListItem}>{`Owned by : ${data[index]?.owner}`}</ListGroup.Item>
        </ListGroup>
      </Card>
    ) : null);

  useEffect(() => {
    setErrorState(undefined);
    setLoadingState(true);
    if (view === 'allTokens') {
      getAllTokens();
    } else {
      getAllMyTokens();
    }
  }, []);

  useEffect(() => {
    setRows(data.map((element:any, index:number) => (
      renderCard(index)
    )));
  }, [data]);

  return (
    <div>
      <Button
        data-testid="backButton"
        style={{ marginTop: '20px' }}
        className="btn"
        onClick={async () => {
          setViewState('tokenQuery');
        }}
      >
        {' '}
        Go Back
        {' '}

      </Button>
      {errorState ? <p style={errorStyle}>{errorState}</p> : undefined}
      {loadingState ? <Spinner style={{ margin: '20px' }} animation="border" role="status" /> : undefined}
      <div>{rows}</div>
    </div>
  );
}

export default AllTokens;
