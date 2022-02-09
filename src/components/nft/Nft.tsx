import React from 'react';
import { useRecoilValue } from 'recoil';
import { nftState, viewState } from '../../state/nftContract';
import ContractMetadata from './ContractMetadata';
import Tokens from './TokenQuery';
import SelectContract from './SelectContract';
import Mint from './Mint';
import AllTokens from './AllTokens';
import Whitelist from './Whitelist';

function Nft() {
  const nft = useRecoilValue(nftState);
  const view = useRecoilValue(viewState);
  return nft.isSelected ? (
    <div>
      <ContractMetadata />
      <hr />
      {view === 'tokenQuery'
        ? (
          <div>
            <Tokens />
            <hr />
            <Mint />
            <hr />
            <Whitelist />
          </div>
        )
        : <AllTokens />}

    </div>

  )
    : (
      <SelectContract />
    );
}

export default Nft;
