/* eslint-disable no-constant-condition */
import React from 'react';
import {
  Row, Col, Table, Button,
} from 'react-bootstrap';
import { PlusCircleFill } from 'react-bootstrap-icons';
import { useSetRecoilState } from 'recoil';
import style from '../../../styles/deploy.module.css';
import projectStyle from '../../../styles/manageProjects.module.css';
import { dropSectionState } from '../../../state/page';

function DropTable() {
  const setDropSection = useSetRecoilState(dropSectionState);
  return (
    <Row
      className={style['form-wrapper']}
      style={{ margin: '3px 0px 0px 0px' }}
    >
      <Col lg={12}>

        {/* Schedule New Drop Button */}
        <Button
          style={{ marginRight: '5px' }}
          className={projectStyle['add-whitelist-record']}
          onClick={() => {
            // @TODO Implement drops feature
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

      {/* Drops Table */}
      <Col lg={12}>
        <hr />
        {/* @TODO Query Drop service and display table if drops.length > 1 */}
        {true ? (
          <p style={{ margin: '30px 0px 30px 0px' }} className={projectStyle['metrics-title']}>
            No drops created yet
          </p>
        ) : (
          <Table borderless>
            <tr className={projectStyle['table-head']}>
              <th>DROP NAME</th>
              <th>ACTIVATES ON</th>
              <th>MINT TIER</th>
              <th>NFT SLOTS</th>
              <th>{'NFT\'S REDEEMED'}</th>
            </tr>
            <tbody>
              {[].map(() => ({}))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default DropTable;
