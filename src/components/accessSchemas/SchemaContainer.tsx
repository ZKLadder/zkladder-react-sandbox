import React, { useState } from 'react';
import {
  Col, Dropdown, Form, Row,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { AccessValidator } from '@zkladder/zkladder-sdk-ts';
import { Trash } from 'react-bootstrap-icons';
import HasBalance from './accessConditions/hasBalance';
import HasBalanceERC20 from './accessConditions/hasBalanceERC20';
import HasERC721 from './accessConditions/hasERC721';
import HasERC1155 from './accessConditions/hasERC1155';
import IsBlacklisted from './accessConditions/isBlacklisted';
import IsWhitelisted from './accessConditions/isWhitelisted';
import style from '../../styles/deploy.module.css';
import { dropUpdatesState } from '../../state/drop';

function SchemaContainer({ index }:{ index:number}) {
  /* eslint-disable-next-line */
  const [dropUpdates, setDropUpdates] = useRecoilState(dropUpdatesState);

  const [gateType, setGateType] = useState(dropUpdates?.accessSchema?.[index]?.key);

  const gateTypes = {
    hasBalance: 'Require minimum balance of ETH or other native coin',
    hasBalanceERC20: 'Require minimum balance of an ERC20 token',
    hasERC721: 'Require ownership of an ERC721 NFT',
    hasERC1155: 'Require ownership of an ERC1155 token',
    isWhitelisted: 'Add single address to whitelist',
    isBlacklisted: 'Add single address to blacklist',
  } as any;

  if (dropUpdates?.accessSchema?.[index]?.operator) return null;

  return (
    <Row className="mx-0 px-0">
      <Col>
        <div style={{
          padding: '10px', marginBottom: '10px', backgroundColor: '#F5F5F5', border: '1px solid #D5D5D5', borderRadius: '0.25rem', minHeight: '150px',
        }}
        >
          <Form.Label className={style['form-label']} style={{ display: 'block', fontSize: '12px' }}>GATE TYPE</Form.Label>
          <Dropdown>
            <Dropdown.Toggle
              data-testid="toggleType"
              style={{
                minWidth: '100%', textAlign: 'left', color: '#16434B', display: 'inline',
              }}
              variant="light"
              className={style['form-dropdown']}
            >
              {gateTypes[gateType]}
            </Dropdown.Toggle>
            <Dropdown.Menu
              align="end"
              style={{
                minWidth: '100%', padding: '1px', maxHeight: '125px', overflow: 'auto',
              }}
              className={style['form-dropdown']}
            >
              {Object.keys(gateTypes).map((type:string) => (
                <Dropdown.Item
                  key={type}
                  onClick={() => {
                    const validator = new AccessValidator(dropUpdates?.accessSchema);
                    if (type === 'hasBalance') {
                      validator.updateAccessCondition({
                        index, key: 'hasBalance', chainId: dropUpdates?.accessSchema?.[index]?.chainId, minBalance: 1,
                      });
                    }
                    if (type === 'hasBalanceERC20') {
                      validator.updateAccessCondition({
                        index, key: 'hasBalanceERC20', chainId: dropUpdates?.accessSchema?.[index]?.chainId, contractAddress: '', minBalance: 1, decimals: 18,
                      });
                    }
                    if (type === 'hasERC721') {
                      validator.updateAccessCondition({
                        index, key: 'hasERC721', chainId: dropUpdates?.accessSchema?.[index]?.chainId, contractAddress: '',
                      });
                    }
                    if (type === 'hasERC1155') {
                      validator.updateAccessCondition({
                        index, key: 'hasERC1155', chainId: dropUpdates?.accessSchema?.[index]?.chainId, contractAddress: '', tokenId: 0,
                      });
                    }
                    if (type === 'isWhitelisted') {
                      validator.updateAccessCondition({
                        index, key: 'isWhitelisted', chainId: dropUpdates?.accessSchema?.[index]?.chainId, whitelistedAddress: '',
                      });
                    }
                    if (type === 'isBlacklisted') {
                      validator.updateAccessCondition({
                        index, key: 'isBlacklisted', chainId: dropUpdates?.accessSchema?.[index]?.chainId, blacklistedAddress: '',
                      });
                    }

                    setDropUpdates({
                      ...dropUpdates,
                      accessSchema: validator.getAccessSchema(),
                    });
                    setGateType(type);
                  }}
                >
                  {gateTypes[type]}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {gateType === 'hasBalance' ? <HasBalance index={index} /> : null}
          {gateType === 'hasBalanceERC20' ? <HasBalanceERC20 index={index} /> : null}
          {gateType === 'hasERC721' ? <HasERC721 index={index} /> : null}
          {gateType === 'hasERC1155' ? <HasERC1155 index={index} /> : null}
          {gateType === 'isBlacklisted' ? <IsBlacklisted index={index} /> : null}
          {gateType === 'isWhitelisted' ? <IsWhitelisted index={index} /> : null}

          <p className="text-center" style={{ margin: '15px 0px 5px 0px' }}>
            <Trash
              size={18}
              role="button"
              data-testid="deleteCondition"
              onClick={() => {
                const validator = new AccessValidator(dropUpdates?.accessSchema);
                validator.deleteAccessCondition(index);
                setDropUpdates({
                  ...dropUpdates,
                  accessSchema: validator.getAccessSchema(),
                });
              }}
            />
          </p>
        </div>
      </Col>
    </Row>
  );
}

export default SchemaContainer;
