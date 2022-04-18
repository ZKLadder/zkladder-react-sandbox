import React from 'react';
import {
  Container, Row, Col, ListGroup, Form, InputGroup, Card,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import {
  PlusCircleFill, Search, QuestionCircle,
} from 'react-bootstrap-icons';
import style from '../../styles/manageProjects.module.css';
import networks from '../../constants/networks';
import { contractAddressState, networkFiltersState } from '../../state/page';

function SearchSidebar() {
  const [searchAddress, setSearchAddress] = useRecoilState(contractAddressState);
  const [networkFilters, setNetworkFilters] = useRecoilState(networkFiltersState);

  return (
    <Container>
      {/* Title */}
      <p className={style.title}>
        MANAGE MY PROJECTS
      </p>

      {/* Description */}
      <p className={style.description}>
        Find, edit and manage all of your deployed projects
      </p>

      {/* New Project Button */}
      <ListGroup.Item className={style['new-deployment-button']}>
        <PlusCircleFill size={20} className={style.icon} />
        NEW PROJECT
      </ListGroup.Item>
      <hr style={{ width: '90%', margin: '16px 0px 16px 0px' }} />

      {/* Search Bar */}
      <ListGroup.Item className={style['search-container']}>
        <InputGroup>
          <InputGroup.Text style={{ borderRadius: '10px 0px 0px 10px' }} className={style.search}>
            <Search />
          </InputGroup.Text>
          <Form.Control
            data-testid="addressSearch"
            style={{ paddingLeft: '0px', borderRadius: '0px 10px 10px 0px' }}
            className={style.search}
            placeholder="PASTE CONTRACT ADDRESS..."
            value={searchAddress}
            onChange={(event) => { setSearchAddress(event.target.value); }}
          />
        </InputGroup>
      </ListGroup.Item>

      {/* Network Filters */}
      <Card className={style['search-card']}>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>NETWORKS</span>
          {/* eslint-disable-next-line */}
          <span
            className={style['select-all']}
            onClick={() => { setNetworkFilters(Object.keys(networks).map((chainId) => (chainId.toString()))); }}
          >
            Select All

          </span>
        </p>
        {Object.keys(networks).map((chainId) => {
          if ((networks as any)[chainId].hide) return null;
          return ((
            <Form.Check key={(networks as any)[chainId].label}>
              <Form.Check.Input
                data-testid={`checkbox-${chainId}`}
                type="checkbox"
                checked={networkFilters.includes(chainId)}
                onChange={() => {
                  const index = networkFilters.indexOf(chainId);
                  const filtersCopy = [...networkFilters];
                  if (index < 0) {
                    filtersCopy.push(chainId);
                    setNetworkFilters(filtersCopy);
                  } else {
                    setNetworkFilters([...filtersCopy.slice(0, index), ...filtersCopy.slice(index + 1)]);
                  }
                }}
              />
              <Form.Check.Label />
              <span>{(networks as any)[chainId].label.toUpperCase()}</span>
            </Form.Check>
          ));
        })}
      </Card>

      {/* Footer */}
      <div className={style['footer-wrapper']}>
        <hr style={{ margin: '0px 0px 8px 0px' }} />
        {/* Support link */}
        <ListGroup.Item className={style.footer}>
          <Row>
            <Col style={{ padding: '5px 0px 0px 0px' }} xs={1}>
              <QuestionCircle size={20} style={{ alignSelf: 'center' }} />
            </Col>
            <Col style={{ marginLeft: '1px' }}>
              <p style={{ display: 'inline' }}>
                Having issues? Questions?
                {' '}
                <a target="_blank" href="https://www.zkladder.com/#join" rel="noreferrer">Get in touch here.</a>
              </p>
            </Col>
          </Row>

        </ListGroup.Item>
        <hr style={{ margin: '8px 0px 0px 0px' }} />
      </div>

    </Container>
  );
}

export default SearchSidebar;
