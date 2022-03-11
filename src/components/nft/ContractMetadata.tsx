import React from 'react';
import { useRecoilValue } from 'recoil';
import { Form } from 'react-bootstrap';
import { nftContractMetadataState } from '../../state/nftContract';
import { NftContractMetadata } from '../../interfaces/nft';
import { shortenAddress } from '../../utils/address';

const contractMetadata = () => {
  const nftContractMetadata = useRecoilValue(nftContractMetadataState) as NftContractMetadata;
  const {
    name, symbol, address, collectionDataUri,
  } = nftContractMetadata;
  return (
    <div>
      <p><Form.Label>{`You are now connected to contract: ${shortenAddress(address as string)}`}</Form.Label></p>
      <p><Form.Label>{`Contract Name: ${name}`}</Form.Label></p>
      <p><Form.Label>{`Contract Symbol: ${symbol}`}</Form.Label></p>
      <p><Form.Label>{`Collection Data URI: ${collectionDataUri}`}</Form.Label></p>
    </div>
  );
};

export default contractMetadata;
