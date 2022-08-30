import React, { useEffect, useState } from 'react';
import {
  Row, Col, Table, Button,
} from 'react-bootstrap';
import { PencilSquare, PlusCircleFill } from 'react-bootstrap-icons';
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import style from '../../../../styles/deploy.module.css';
import projectStyle from '../../../../styles/manageProjects.module.css';
import { dropSectionState, currentDropState } from '../../../../state/page';
import { createDrop, getDrops } from '../../../../utils/api';
import { contractsWithMetadataState, selectedContractState } from '../../../../state/contract';
import Loading from '../../../shared/Loading';
import { ContractWithMetadata, Drop } from '../../../../interfaces/contract';

function DropTable() {
  const setDropSection = useSetRecoilState(dropSectionState);
  const setCurrentDrop = useSetRecoilState(currentDropState);
  const { address, chainId } = useRecoilValue(selectedContractState) as { address: string, chainId: string };

  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const contractData = contractsWithMetadata?.contents?.[address as string] as ContractWithMetadata;

  const [dropsLoading, setDropsLoading] = useState(true);
  const [dropsList, setDropsList] = useState([]);

  // Retrieve drops from backend
  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const drops = await getDrops({ contractAddress: address, chainId });
        setDropsList(drops);
        setDropsLoading(false);
      } catch (err: any) {
        setDropsLoading(false);
      }
    };

    fetchDrops();
  }, []);

  return (
    <Row
      className={style['form-wrapper']}
      style={{ margin: '3px 0px 0px 0px' }}
    >
      {/* Drops Table */}
      <Col lg={12} style={{ maxHeight: '45vh', overflow: 'auto' }}>
        {dropsLoading ? <Loading /> : null}
        {!dropsLoading && dropsList.length < 1 ? (
          <p style={{ margin: '30px 0px 30px 0px' }} className={projectStyle['metrics-title']}>
            No drops created yet
          </p>
        ) : null}
        {!dropsLoading && dropsList.length > 0 ? (
          <Table borderless>
            <tbody>
              <tr className={projectStyle['table-head']}>
                <th>DROP NAME</th>
                <th>MINTING OPENS</th>
                <th>MEMBERSHIP TIER</th>
                <th>{'NFT\'S AVAILABLE'}</th>
                <th>{'NFT\'S MINTED'}</th>
              </tr>
              {dropsList.map((drop: Drop) => (
                <tr key={drop.id}>
                  <td style={{ padding: '2px 2px 2px 10px' }}>
                    <div className={projectStyle['table-data']}>{drop?.name}</div>
                  </td>
                  <td style={{ padding: '2px' }}>
                    <div className={projectStyle['table-data']}>{drop?.startTime ? new Date(drop?.startTime).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }) : ''}</div>
                  </td>
                  <td style={{ padding: '2px' }}>
                    <div className={projectStyle['table-data']}>{contractData?.tiers?.[drop?.tierId]?.name || `TierId: ${drop.tierId}`}</div>
                  </td>
                  <td style={{ padding: '2px' }}>
                    <div className={projectStyle['table-data']}>{drop?.totalTokens || 0}</div>
                  </td>
                  <td style={{ padding: '2px' }}>
                    <div className={projectStyle['table-data']}>{0}</div>
                  </td>
                  <td style={{ padding: '10px 0px 0px 0px' }} className="text-center">
                    <PencilSquare
                      onClick={() => {
                        setCurrentDrop(drop);
                        setDropSection('manageDrop');
                      }}
                      size={20}
                      style={{ marginRight: '3px', marginLeft: '3px' }}
                      className={projectStyle['drop-form-step-icon-active']}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </Col>

      <Col lg={12}>
        <hr />
        {/* Schedule New Drop Button */}
        <Button
          style={{ marginRight: '5px' }}
          className={projectStyle['add-whitelist-record']}
          onClick={async () => {
            const newDrop = await createDrop({
              contractAddress: address,
              chainId,
              tierId: contractData?.tiers?.[0]?.tierId as number,
            });
            setCurrentDrop(newDrop);
            setDropSection('manageDrop');
          }}
        >
          <PlusCircleFill size={20} className={projectStyle['add-whitelist-icon']} />
          SCHEDULE A NEW DROP
        </Button>

        {/* Mint a Single NFT Button */}
        <Button
          className={projectStyle['admin-mint-button']}
          onClick={() => {
            setDropSection('airDrop');
          }}
        >
          <PlusCircleFill size={20} className={projectStyle['admin-mint-icon']} />
          MINT A SINGLE NFT
        </Button>
      </Col>
    </Row>
  );
}

export default DropTable;
