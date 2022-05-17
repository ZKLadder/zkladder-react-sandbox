import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Form, Button, Table,
} from 'react-bootstrap';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { CheckSquare, PlusCircleFill, XCircle } from 'react-bootstrap-icons';
import style from '../../styles/deploy.module.css';
import projectStyle from '../../styles/manageProjects.module.css';
import { contractsWithMetadataState, selectedContractState, WhitelistState } from '../../state/contract';
import { nftTokensEnumerable } from '../../state/nftContract';
import Loading from '../shared/Loading';
import WhitelistModal from './WhitelistModal';
import { getOwnerBalances } from '../../utils/blockchainData';
import { MintVoucher } from '../../interfaces/contract';

function Whitelist() {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const address = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string];
  const whitelist = useRecoilValueLoadable(WhitelistState);
  const nftTokens = useRecoilValueLoadable(nftTokensEnumerable);

  const [modalOpen, setModalOpen] = useState(false);

  const [whitelistWithRedemptions, setWhitelistWithRedemptions] = useState(undefined) as any;

  // Get NFT owner addresses to determine which vouchers have been redeemed
  useEffect(() => {
    async function getRedemptions() {
      const tokensLoaded = (nftTokens.contents.length && nftTokens.contents[0].tokenUri);
      const ownerBalances = await getOwnerBalances(contractData, tokensLoaded ? nftTokens?.contents : undefined);
      setWhitelistWithRedemptions(whitelist.contents.map((voucher:any) => ({
        ...voucher,
        redeemed: !!(ownerBalances as any)[voucher.userAddress],
      })));
    }

    if (contractData && whitelist.state === 'hasValue' && nftTokens.state === 'hasValue') {
      getRedemptions();
    }
  }, [whitelist, nftTokens]);

  // Loading Indicator
  if (!whitelistWithRedemptions) return <Loading />;

  return (
    <Container className={style['template-wrapper']}>
      <Row style={{ margin: '0px' }} className={style['form-wrapper']}>

        {/* Whitelist Enabled */}
        <Col lg={5} style={{ border: '1px solid #F5F5F5', padding: '10px' }}>
          <Form.Check>
            <Form.Check.Input
              style={{ marginTop: '7px' }}
              type="checkbox"
              checked
            />
            <Form.Check.Label />
            <span style={{ fontSize: '13px' }} className={style['form-label']}>ENABLE WHITELIST</span>
          </Form.Check>
        </Col>

        {/* Records Count */}
        <Col lg={2} style={{ backgroundColor: '#F5F5F5', padding: '6px', marginLeft: '5px' }}>
          <p style={{ lineHeight: '16px' }} className={projectStyle['metrics-figure']}>{whitelist?.contents?.length}</p>
          <p style={{ lineHeight: '16px', margin: '0px' }} className={projectStyle['metrics-title']}>Records</p>
        </Col>

        {/* Add Record Button */}
        <Col lg={3} style={{ paddingLeft: '5px' }}>
          <Button
            className={projectStyle['add-whitelist-record']}
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <PlusCircleFill size={20} className={projectStyle['add-whitelist-icon']} />
            ADD NEW RECORD
          </Button>
        </Col>
      </Row>

      {/* Whitelist Table */}
      <div
        className={style['form-wrapper']}
        style={{
          padding: '0px 3px 0px 3px', overflow: 'auto', marginTop: '3px', maxHeight: '55vh',
        }}
      >
        <Table borderless>
          <tr className={projectStyle['table-head']}>
            <th>CREATED</th>
            <th>REDEEMED</th>
            <th>USER ADDRESS</th>
            <th># WHITELISTED</th>
            <th>TIER ACCESS</th>
            <th>NOTE</th>
          </tr>
          <tbody>
            {whitelistWithRedemptions.map((voucher: MintVoucher) => (
              <tr key={voucher.userAddress + voucher.createdAt}>
                <td style={{ padding: '2px 2px 2px 10px' }}>
                  <div className={projectStyle['table-data']}>{new Date(voucher.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}</div>
                </td>
                <td style={{ padding: '2px' }}>
                  <div className={`${projectStyle['table-data']} text-center`}>{voucher.redeemed ? <CheckSquare style={{ color: '#4EB9B1' }} size={15} /> : <XCircle style={{ color: '#DB0056' }} size={15} />}</div>
                </td>
                <td style={{ padding: '2px' }}>
                  <div className={projectStyle['table-data']}>{voucher.userAddress}</div>
                </td>
                <td style={{ padding: '2px' }}>
                  <div className={projectStyle['table-data']}>{voucher.balance}</div>
                </td>
                <td style={{ padding: '2px' }}>
                  <div className={projectStyle['table-data']}>{voucher.roleId}</div>
                </td>
                <td style={{ padding: '2px 10px 2px 2px' }}>
                  <div className={projectStyle['table-data']}>{voucher.note}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <WhitelistModal open={modalOpen} closeModal={() => { setModalOpen(false); }} />
    </Container>

  );
}

export default Whitelist;
