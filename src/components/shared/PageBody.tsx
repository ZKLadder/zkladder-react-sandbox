import React from 'react';
import {
  Card,
} from 'react-bootstrap';

import '../../styles/body.css';

function PageBody({ color, children }:{color:{start:string, end:string}, children: React.ReactNode}) {
  return (
    <Card className="background-container" style={{ background: `linear-gradient(${color.start}, ${color.end})` }}>
      {children}
    </Card>
  );
}

export default PageBody;
