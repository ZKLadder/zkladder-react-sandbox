import React from 'react';
import { ListGroup } from 'react-bootstrap';
import style from '../../styles/shared.module.css';

function SidebarStep({
  step,
  text,
  isActivated,
}: {
  step:number,
  text:string,
  isActivated:boolean,
}) {
  return (
    <ListGroup.Item data-testid="parent" className={isActivated ? style['sidebar-step-activated'] : style['sidebar-step']}>
      <p
        className={isActivated ? style['sidebar-step-number-activated'] : style['sidebar-step-number']}
      >
        {step}
      </p>
      <p
        className={isActivated ? style['sidebar-step-text-activated'] : style['sidebar-step-text']}
      >
        {text}
      </p>
    </ListGroup.Item>
  );
}

export default SidebarStep;
