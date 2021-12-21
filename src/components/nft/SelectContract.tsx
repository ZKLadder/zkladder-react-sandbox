import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Form, Button } from 'react-bootstrap';
import Zkl from '@zkladder/zkladder-sdk-ts';
import { nftState } from '../../state/nftContract';
import { walletState } from '../../state/wallet';
import errorStyle from '../../styles/error';
import { WalletStateInterface } from '../../interfaces/wallet';

const selectContract = () => {
  const [formEntry, setFormEntry] = useState('');
  const [errorState, setErrorState] = useState();
  const setNftState = useSetRecoilState(nftState);
  const { provider } = useRecoilValue(walletState) as WalletStateInterface;
  return (
    <Form.Group>
      <Form.Label>Enter an NFT contract address to get started</Form.Label>
      <Form.Control
        data-testid="addressForm"
        onChange={(event) => { setFormEntry(event.target.value); }}
        type="text"
        style={{ width: '60%' }}
        placeholder="0x..."
      />
      <Button
        data-testid="selectButton"
        style={{ marginTop: '10px' }}
        className="btn"
        onClick={async () => {
          try {
            setErrorState(undefined);
            // @TODO Instantiate with a real projectID
            const zkLadder = new Zkl('12345', provider);
            const nftInstance = await zkLadder.nft(formEntry); // Potentially throws
            setNftState({
              refreshCounter: 1,
              instance: nftInstance,
              address: formEntry,
              isSelected: true,
            });
          } catch (error:any) {
            setErrorState(error.message || 'There was an issue connecting to this NFT contract');
          }
        }}
      >
        {' '}
        Enter
        {' '}

      </Button>
      {errorState ? <p style={errorStyle}>{errorState}</p> : undefined}
    </Form.Group>
  );
};

export default selectContract;
