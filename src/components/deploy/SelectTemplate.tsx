import React from 'react';
import {
  Container, Col, Row, Badge, Button,
} from 'react-bootstrap';
import {
  Easel, People, Safe, CashStack, Sliders, TicketPerforated,
} from 'react-bootstrap-icons';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { deployState } from '../../state/deploy';
import style from '../../styles/deploy.module.css';
import sharedStyle from '../../styles/shared.module.css';

// Seperate component which renders individual template box
function TemplateBox(props:{title:string, description:string, icon:any, badgeText:string, active:boolean}) {
  const [deploy, setDeployState] = useRecoilState(deployState);

  const {
    title, description, icon, badgeText, active,
  } = props;

  const handleClick = () => {
    if (active) {
      setDeployState({
        ...deploy,
        selectedTemplate: title,
        currentStep: 2,
      });
    }
  };

  return (
    <div
      tabIndex={0}
      className={active ? style['template-box'] : style['template-box-inactive']}
      onClick={handleClick}
      onKeyDown={handleClick}
      role="link"
    >
      <span className={style['template-title']}>{title}</span>
      {icon}
      <hr style={{ marginTop: '5px' }} />
      <span className={style['template-description']}>
        {description}
      </span>

      {active
        ? <Badge className={style['template-badge']}>{badgeText}</Badge>
        : <Badge className={style['template-badge-inactive']}>Coming Soon!</Badge>}

    </div>
  );
}

// Main component which renders page
function SelectTemplate() {
  const navigate = useNavigate();
  return (
    <Container className={sharedStyle['body-wrapper']}>
      <p className={style.title}>
        SELECT A TEMPLATE
      </p>

      {/* Templates wrapper (2 rows of 3 columns) */}
      <Row className={style['template-wrapper']}>
        <Col lg={4}>
          <TemplateBox
            title="MEMBER NFT"
            description="Create a whitelisted NFT based community with configurable tiers of membership."
            icon={<People size={36} className={style['template-icon']} />}
            badgeText="ERC-721"
            active
          />
        </Col>
        <Col lg={4}>
          <TemplateBox
            title="GOVERNANCE TOKEN"
            description="Create a token based governance scheme for voting on proposals, resolving issues, and deciding community direction"
            icon={<Sliders size={36} className={style['template-icon']} />}
            badgeText="ERC-721"
            active={false}
          />
        </Col>
        <Col lg={4}>
          <TemplateBox
            title="ART COLLECTION"
            description="Curate a digital art collection by digitizing your assets and offering them direct to patrons"
            icon={<Easel size={36} className={style['template-icon']} />}
            badgeText="ERC-721"
            active={false}
          />
        </Col>
      </Row>
      <Row className={style['template-wrapper']}>
        <Col lg={4}>
          <TemplateBox
            title="EVENT ADMISSION"
            description="Create digital event access on or offline which can give special privledges to certain token holders"
            icon={<TicketPerforated size={36} className={style['template-icon']} />}
            badgeText="ERC-721"
            active={false}
          />
        </Col>
        <Col lg={4}>
          <TemplateBox
            title="DAO"
            description="Create a transparent purpose-driven treasury governed by tokenholders"
            icon={<Safe size={36} className={style['template-icon']} />}
            badgeText="ERC-721"
            active={false}
          />
        </Col>
        <Col lg={4}>
          <TemplateBox
            title="CURRENCY"
            description="Create a fungible digital token your community can use for loyalty programs, member benefits, or internal exchange"
            icon={<CashStack size={36} className={style['template-icon']} />}
            badgeText="ERC-721"
            active={false}
          />
        </Col>
      </Row>

      {/* Return button */}
      <Button
        className={style['return-button']}
        onClick={() => { navigate(-1); }}
      >
        GO BACK
      </Button>
    </Container>
  );
}

export default SelectTemplate;
export { TemplateBox }; // for unit testing
