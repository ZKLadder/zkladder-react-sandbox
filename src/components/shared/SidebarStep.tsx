import React from 'react';
import { ListGroup } from 'react-bootstrap';
import '../../styles/shared.css';

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
    <ListGroup.Item data-testid="parent" className={isActivated ? 'sidebar-step-activated' : 'sidebar-step'}>
      <p
        className={isActivated ? 'sidebar-step-number-activated' : 'sidebar-step-number'}
      >
        {step}
      </p>
      <p
        className={isActivated ? 'sidebar-step-text-activated' : 'sidebar-step-text'}
      >
        {text}
      </p>
    </ListGroup.Item>
  );
}

export default SidebarStep;
