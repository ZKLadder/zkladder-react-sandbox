import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';

function Tooltip(props:{className:string, header:string, body:string}) {
  const {
    className, header, body,
  } = props;
  return (
    <OverlayTrigger
      placement="right"
      overlay={(
        <Popover>
          <Popover.Header as="h3">{header}</Popover.Header>
          <Popover.Body>
            {body}
          </Popover.Body>
        </Popover>
)}
    >
      <QuestionCircle data-testid="icon" className={className} />
    </OverlayTrigger>
  );
}

export default Tooltip;
