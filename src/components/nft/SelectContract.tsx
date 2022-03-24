import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Form, Button } from 'react-bootstrap';
import { MemberNft } from '@zkladder/zkladder-sdk-ts';
import { nftState } from '../../state/nftContract';
import { walletState } from '../../state/wallet';
import Error from '../shared/Error';
import { WalletStateInterface } from '../../interfaces/wallet';
import config from '../../config';

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
            const nftInstance = await MemberNft.setup({ // Potentially throws
              address: formEntry,
              provider,
              infuraIpfsProjectId: config.ipfs.projectId as string,
              infuraIpfsProjectSecret: config.ipfs.projectSecret as string,
            });
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
      {errorState ? <Error text={errorState} /> : undefined}
    </Form.Group>
  );
};

export default selectContract;
