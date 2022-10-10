import React, { useEffect } from 'react';
import { useRecoilValueLoadable, useRecoilState, useRecoilValue } from 'recoil';
import { Figure, Card } from 'react-bootstrap';
import { Ipfs, MemberNftV2ReadOnly } from '@zkladder/zkladder-sdk-ts';
import axios from 'axios';
import { MemberNftV1ReadOnly } from '@zkladder/zkladder-sdk-ts/dist/services/memberNftV1';
import CopyToClipboard from '../shared/CopyToClipboard';
import { ContractWithMetadata } from '../../interfaces/contract';
import { contractsWithMetadataState, selectedContractState } from '../../state/contract';
import { nftTokenState, selectedNftState, nftSearchText } from '../../state/nftContract';
import placeholder from '../../images/dashboard/placeholder.png';
import config from '../../config';
import style from '../../styles/manageProjects.module.css';
import { shortenAddress } from '../../utils/helpers';

function NftBox({ index }:{index:number}) {
  const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectId);
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address, templateId } = useRecoilValue(selectedContractState);
  const [nftToken, setNftToken] = useRecoilState(nftTokenState(`${address}:${index}`));
  const [selectedNft, setSelectedNft] = useRecoilState(selectedNftState);
  const nftSearch = useRecoilValue(nftSearchText);

  // Fetch NFT data and store in recoil
  useEffect(() => {
    const contractData: ContractWithMetadata = contractsWithMetadata?.contents?.[address as string];
    async function fetchNftData() {
      try {
        const { memberNft } = contractData;

        let token;
        if (templateId === '1') {
          token = await (memberNft as MemberNftV1ReadOnly).getToken(index);
        } else {
          token = await (memberNft as MemberNftV2ReadOnly).getTokenByIndex(index);
        }

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
        <p style={{ marginBottom: '2px' }}>TOKEN ID:</p>
        <span className={style['nft-field']}>{nftToken.tokenId}</span>
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
