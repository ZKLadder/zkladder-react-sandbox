import React from 'react';
import {
  Row, Col, Container, InputGroup, Form, Figure,
} from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
// @ts-ignore
import VirtualGrid from 'react-responsive-virtual-grid';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { Ipfs } from '@zkladder/zkladder-sdk-ts';
import NftBox from './NftBox';
import { contractsWithMetadataState, selectedContractState } from '../../state/contract';
import { selectedNftState, nftTokenState, nftSearchText } from '../../state/nftContract';
import style from '../../styles/manageProjects.module.css';
import placeholder from '../../images/dashboard/placeholder.png';
import { shortenAddress } from '../../utils/helpers';
import networks from '../../constants/networks';
import config from '../../config';
import CopyToClipboard from '../shared/CopyToClipboard';

function Collection() {
  const ipfs = new Ipfs(config.ipfs.projectId, config.ipfs.projectId);
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address } = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string];
  const selectedNft = useRecoilValue(nftTokenState(`${address}:${useRecoilValue(selectedNftState)}`));
  const [nftSearch, setNftSearch] = useRecoilState(nftSearchText);

  return (
    <Row>
      {/* Selected Nft Sidebar */}
      <Col lg={3}>
        <Container style={{ paddingBottom: '10px', backgroundColor: 'white' }}>

          {/* Selected Nft Image */}
          <Figure.Image
            data-testid="image"
            className={style['project-image']}
            src={selectedNft?.image ? ipfs.getGatewayUrl(selectedNft?.image as string) : placeholder}
            alt={selectedNft?.image || placeholder}
            style={{
              backgroundColor: 'white', borderRadius: '0px',
            }}
          />
          {selectedNft?.tokenUri ? (
            <div>

              {/* Selected Nft Name */}
              <div style={{ fontWeight: 'bold' }} className={style['nft-sidebar-field']}>
                {selectedNft?.name || selectedNft?.tokenId}
              </div>

              {/* Selected Nft Owner Address */}
              <div className={style['nft-sidebar-field']}>
                <span style={{ marginRight: '5px' }}>OWNER:</span>
                <CopyToClipboard
                  className={style['nft-field']}
                  text={shortenAddress(selectedNft.owner)}
                />
              </div>

              {/* Selected Nft TokenId and ERC-721 Pill */}
              <Row style={{ margin: '0px' }}>
                <Col lg={7} style={{ margin: '0px', padding: '0px' }}>
                  <div className={style['nft-sidebar-field']}>
                    <span>TOKEN ID:</span>
                    <span style={{ marginLeft: '5px' }} className={style['nft-field']}>{selectedNft.tokenId}</span>
                  </div>
                </Col>
                <Col lg={5} style={{ marginLeft: '0px', padding: '0px' }}>
                  <div className={style['nft-sidebar-field']} style={{ marginLeft: '2px' }}>
                    <span
                      style={{
                        backgroundColor: '#16434B', color: 'white', padding: '4px', borderRadius: '5px',
                      }}
                    >
                      ERC-721
                    </span>
                  </div>
                </Col>
              </Row>

              {/* Selected Nft Chain */}
              <div className={style['nft-sidebar-field']}>
                <span className={style.figure}>
                  <img className={style['network-logo']} alt={(networks as any)[contractData?.chainId]?.label} src={(networks as any)[contractData?.chainId]?.logo} />
                  {(networks as any)[contractData?.chainId]?.label}
                </span>
              </div>

              {/* Selected Nft Properties */}
              <Row style={{ margin: '5px 0px 0px 0px' }} className={style['nft-sidebar-field']}>
                <p style={{ marginBottom: '5px' }}>PROPERTIES (METADATA)</p>
                {selectedNft?.attributes?.map((attribute:any) => (
                  <Col lg={3} key={attribute.trait_type + attribute.value} className={`${style['nft-property']} mx-1`}>
                    <p style={{
                      fontWeight: 'bold', color: '#4EB9B1', margin: '0px', lineHeight: '20px',
                    }}
                    >
                      {attribute.trait_type}
                    </p>
                    <p style={{ margin: '0px', lineHeight: '20px' }}>{attribute.value}</p>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            // Selected Nft Placeholder
            <div className={(contractData?.name && contractData?.totalSupply <= 0) ? style['nft-sidebar-field'] : `${style['nft-sidebar-field']} ${style.placeholder}`} style={{ minHeight: '276px' }} />
          )}

        </Container>
      </Col>

      {/* Main Section */}
      <Col style={{
        overflow: 'auto', height: '570px', backgroundColor: 'white', padding: '15px',
      }}
      >

        {/* Search Bar */}
        <InputGroup style={{ width: '40%', marginBottom: '10px' }}>
          <InputGroup.Text style={{ borderRadius: '5px 0px 0px 0px' }} className={style['nft-search']}>
            <Search />
          </InputGroup.Text>
          <Form.Control
            data-testid="addressSearch"
            style={{ paddingLeft: '5px', borderRadius: '0px 5px 0px 0px' }}
            className={style['nft-search']}
            placeholder="TOKEN ID ..."
            value={nftSearch}
            onChange={(event) => { setNftSearch(event.target.value); }}
          />
        </InputGroup>

        {/* No tokens message || virtualized grid with individual Nft boxes */}
        {contractData?.totalSupply <= 0
          ? <p style={{ marginTop: '20px' }} className={style['metrics-title']}>No tokens minted yet</p>
          : (
            <VirtualGrid
              total={contractData?.totalSupply}
              cell={{ height: 100, width: 100 }}
              child={NftBox}
            />
          )}

      </Col>
    </Row>
  );
}

export default Collection;
