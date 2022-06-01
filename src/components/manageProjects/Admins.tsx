import React, { useState } from 'react';
import {
  Container, Row, Col, Button, Table,
} from 'react-bootstrap';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { PlusCircleFill } from 'react-bootstrap-icons';
import { contractsWithMetadataState, selectedContractState } from '../../state/contract';
import AdminsModal from './AdminsModal';
import style from '../../styles/deploy.module.css';
import projectStyle from '../../styles/manageProjects.module.css';

function Admins() {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const address = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string];
  const [modalOpen, setModalOpen] = useState('');

  return (
    <Container className={style['template-wrapper']}>
      <Row style={{ margin: '0px' }} className={style['form-wrapper']}>

        {/* Heading and Description */}
        <Col lg={12}>
          <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0px' }}>SET UP OTHER ACCOUNTS AS CONTRACT MANAGERS</p>
          <p style={{ fontSize: '14px' }}>You can assign individual wallets the appropriate permissions below. Adminstrators will have full access to revoke permissions for other accounts.</p>
          <hr />
        </Col>

        {/* Administrators Section */}
        <Col lg={2} style={{ backgroundColor: '#F5F5F5', padding: '6px', marginLeft: '5px' }}>
          <p style={{ lineHeight: '16px' }} className={projectStyle['metrics-figure']}>{contractData?.adminAccounts?.length}</p>
          <p style={{ lineHeight: '16px', margin: '0px' }} className={projectStyle['metrics-title']}>Records</p>
        </Col>
        <Col lg={3} style={{ paddingLeft: '5px' }}>
          <Button
            data-testid="newAdmin"
            className={projectStyle['add-whitelist-record']}
            onClick={() => {
              setModalOpen('admin');
            }}
          >
            <PlusCircleFill size={20} className={projectStyle['add-whitelist-icon']} />
            ADD NEW RECORD
            {' '}

          </Button>
        </Col>
        <Col lg={12} style={{ marginTop: '5px', borderRadius: '5px', border: '1px solid #D5D5D5' }}>
          <p style={{
            paddingLeft: '10px', fontSize: '14px', fontWeight: 'bold', margin: '10px 0px 5px 0px',
          }}
          >
            ADMINISTRATOR ACCOUNTS
          </p>
          <div style={{ overflow: 'auto', maxHeight: '15vh' }}>
            <Table style={{ paddingTop: '5px' }} className={style['form-wrapper']} borderless>
              <tbody>
                {contractData?.adminAccounts?.map((admin:string) => (
                  <tr key={admin}>
                    <td style={{ padding: '2px 20px 2px 10px' }}>
                      <div className={projectStyle['table-data']}>{admin}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>

        {/* Break Section */}
        <Col lg={12}>
          <hr />
        </Col>

        {/* Minters Section */}
        <Col lg={2} style={{ backgroundColor: '#F5F5F5', padding: '6px', marginLeft: '5px' }}>
          <p style={{ lineHeight: '16px' }} className={projectStyle['metrics-figure']}>{contractData?.minterAccounts?.length}</p>
          <p style={{ lineHeight: '16px', margin: '0px' }} className={projectStyle['metrics-title']}>Records</p>
        </Col>
        <Col lg={3} style={{ paddingLeft: '5px' }}>
          <Button
            data-testid="newMinter"
            className={projectStyle['add-whitelist-record']}
            onClick={() => {
              setModalOpen('minter');
            }}
          >
            <PlusCircleFill size={20} className={projectStyle['add-whitelist-icon']} />
            ADD NEW RECORD
          </Button>
        </Col>
        <Col lg={12} style={{ marginTop: '5px', borderRadius: '5px', border: '1px solid #D5D5D5' }}>
          <p style={{
            paddingLeft: '10px', fontSize: '14px', fontWeight: 'bold', margin: '10px 0px 5px 0px',
          }}
          >
            MINTER ACCOUNTS
          </p>
          <div style={{ overflow: 'auto', maxHeight: '15vh' }}>
            <Table style={{ paddingTop: '5px' }} className={style['form-wrapper']} borderless>
              <tbody>
                {contractData?.minterAccounts?.map((minter:string) => (
                  <tr key={minter}>
                    <td style={{ padding: '2px 20px 2px 10px' }}>
                      <div className={projectStyle['table-data']}>{minter}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Create Modal */}
      <AdminsModal open={modalOpen} closeModal={() => { setModalOpen(''); }} />
    </Container>

  );
}

export default Admins;