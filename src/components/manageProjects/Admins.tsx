import React, { useState } from 'react';
import {
  Container, Row, Col, Button, Table,
} from 'react-bootstrap';
import {
  useRecoilValue, useRecoilValueLoadable, useSetRecoilState, useRecoilRefresher_UNSTABLE as useRecoilRefresherUnstable,
} from 'recoil';
import { PlusCircleFill } from 'react-bootstrap-icons';
import { contractsWithMetadataState, selectedContractState, writableContractState } from '../../state/contract';
import { errorState, loadingState } from '../../state/page';
import AdminsModal from './AdminsModal';
import style from '../../styles/deploy.module.css';
import projectStyle from '../../styles/manageProjects.module.css';
import { shortenAddress } from '../../utils/helpers';
import { updateContract } from '../../utils/api';

function Admins() {
  const contractsWithMetadata = useRecoilValueLoadable(contractsWithMetadataState);
  const { address, chainId } = useRecoilValue(selectedContractState);
  const contractData = contractsWithMetadata?.contents?.[address as string];
  const writeableContract = useRecoilValueLoadable(writableContractState)?.contents;
  const refresh = useRecoilRefresherUnstable(contractsWithMetadataState);

  const setError = useSetRecoilState(errorState);
  const setLoading = useSetRecoilState(loadingState);
  const [modalOpen, setModalOpen] = useState('');

  const admins = contractData?.admins;

  return (
    <Container className={style['template-wrapper']}>
      <Row style={{ margin: '0px' }} className={style['form-wrapper']}>

        {/* Heading and Description */}
        <Col lg={12}>
          <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0px' }}>DESIGNATE CONTRACT MANAGERS</p>
          <p style={{ fontSize: '14px' }}>You can assign other accounts the appropriate permissions below.</p>
          <hr />
        </Col>

        {/* Administrators Section */}
        <Col lg={2} style={{ backgroundColor: '#F5F5F5', padding: '6px', marginLeft: '5px' }}>
          <p style={{ lineHeight: '16px' }} className={projectStyle['metrics-figure']}>{contractData?.adminAccounts?.length}</p>
          <p style={{ lineHeight: '16px', margin: '0px' }} className={projectStyle['metrics-title']}>Accounts</p>
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
            ADD NEW ADMIN
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

                    {/* Admin Address */}
                    <td style={{ padding: '2px 10px 2px 10px', width: '95%' }}>
                      <div className={projectStyle['table-data']}>{admin}</div>
                    </td>

                    {/* Remove Admin Button */}
                    <td style={{ padding: '2px 5px 2px 5px' }}>
                      <Button
                        data-testid={`removeAdmin-${admin}`}
                        className={projectStyle['remove-whitelist-record']}
                        style={{ minHeight: '0px', padding: '10px', margin: '0px' }}
                        onClick={async () => {
                          try {
                            if (writeableContract) {
                              setLoading({
                                loading: true,
                                header: `Removing admin ${shortenAddress(admin)}`,
                                content: 'Awaiting user signature',
                              });

                              const tx = await writeableContract.revokeRole('DEFAULT_ADMIN_ROLE', admin);

                              setLoading({
                                loading: true,
                                header: `Removing minter ${shortenAddress(admin)}`,
                                content: 'Transaction is being mined',
                              });

                              await tx.wait();

                              await updateContract({
                                address: address as string,
                                chainId: chainId as string,
                                admins: admins ? admins.filter((adm:string) => (adm.toLowerCase() !== admin.toLowerCase())) : [],
                              });

                              refresh();
                              setLoading({ loading: false });
                            }
                          } catch (err:any) {
                            setLoading({
                              loading: false,
                            });
                            setError({
                              showError: true,
                              content: err.message || 'There was an error completing your transaction',
                            });
                          }
                        }}
                      >
                        REMOVE
                      </Button>
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
          <p style={{ lineHeight: '16px', margin: '0px' }} className={projectStyle['metrics-title']}>Accounts</p>
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
            ADD NEW MINTER
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

                    {/* Minter Address */}
                    <td style={{ padding: '2px 10px 2px 10px', width: '95%' }}>
                      <div className={projectStyle['table-data']}>{minter}</div>
                    </td>

                    {/* Remove Minter Button */}
                    <td style={{ padding: '2px 5px 2px 5px' }}>
                      <Button
                        data-testid={`removeMinter-${minter}`}
                        className={projectStyle['remove-whitelist-record']}
                        style={{ minHeight: '0px', padding: '10px', margin: '0px' }}
                        onClick={async () => {
                          try {
                            if (writeableContract) {
                              setLoading({
                                loading: true,
                                header: `Removing minter ${shortenAddress(minter)}`,
                                content: 'Awaiting user signature',
                              });

                              const tx = await writeableContract.revokeRole('MINTER_ROLE', minter);

                              setLoading({
                                loading: true,
                                header: `Removing minter ${shortenAddress(minter)}`,
                                content: 'Transaction is being mined',
                              });

                              await tx.wait();

                              refresh();
                              setLoading({ loading: false });
                            }
                          } catch (err:any) {
                            setLoading({
                              loading: false,
                            });
                            setError({
                              showError: true,
                              content: err.message || 'There was an error completing your transaction',
                            });
                          }
                        }}
                      >
                        REMOVE
                      </Button>
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
