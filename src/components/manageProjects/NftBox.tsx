import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValueLoadable, useRecoilState, useRecoilValue } from 'recoil';
import { Figure, Card } from 'react-bootstrap';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import axios from 'axios';
import CopyToClipboard from '../shared/CopyToClipboard';
import { ContractWithMetadata } from '../../interfaces/contract';
import { contractsWithMetadataState } from '../../state/contract';
import { nftTokenState, selectedNftState, nftSearchText } from '../../state/nftContract';
import placeholder from '../../images/dashboard/placeholder.png';
import config from '../../config';
import style from '../../styles/manageProjects.module.css';
import { shortenAddress } from '../../utils/helpers';

function NftBox({ index }:{index:number}) {
  const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectId);
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address } = useParams();
  const [nftToken, setNftToken] = useRecoilState(nftTokenState(`${address}:${index}`));
  const [selectedNft, setSelectedNft] = useRecoilState(selectedNftState);
  const nftSearch = useRecoilValue(nftSearchText);

  // Fetch NFT data and store in recoil
  useEffect(() => {
    const contractData: ContractWithMetadata = contractsWithMetadata?.contents?.[address as string];
    async function fetchNftData() {
      try {
        const { memberNft } = contractData;
        const token = await memberNft.getToken(index);
        const { data } = await axios(ipfs.getGatewayUrl(token?.tokenUri as string));
        setNftToken({ ...token, ...data });
      } catch (err:any) {
        setNftToken({});
      }
    }
    if (contractData && !nftToken.tokenUri) {
      fetchNftData();
    }
  }, [contractsWithMetadata]);

  // If NFT does not match tokenId search then return null
  const searchRegex = new RegExp(nftSearch.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
  if (nftSearch.length && !index.toString().match(searchRegex)) return null;
  return (
    <Card className={style['nft-box']} style={selectedNft === index ? { border: '2px solid #A40A3E' } : {}}>

      {/* NFT Image */}
      <Figure.Image
        data-testid="image"
        className={style['nft-image']}
        src={nftToken?.image ? ipfs.getGatewayUrl(nftToken?.image as string) : placeholder}
        alt={placeholder}
        style={{
          backgroundColor: 'white', borderRadius: '0px',
        }}
        onClick={() => {
          setSelectedNft(index);
        }}
      />

      {/* NFT ID */}
      <p style={{ margin: '10px' }}>
        <span>TOKEN ID:</span>
        <span style={{ marginLeft: '10px' }} className={style['nft-field']}>{index}</span>
      </p>

      {/* NFT Owner */}
      <p style={{ margin: '0px 10px 10px 10px' }}>
        <span>OWNED BY:</span>
        <CopyToClipboard
          className={`${style['nft-field']} ${style['nft-field-full']}`}
          text={shortenAddress(nftToken.owner)}
        />
      </p>
    </Card>
  );
}

export default NftBox;
