import React from 'react';
import {
  Card,
} from 'react-bootstrap';
import style from '../../styles/body.module.css';

function PageBody({ color, children }:{color:{start:string, end:string}, children: React.ReactNode}) {
  return (
    <Card className={style['background-container']} style={{ background: `linear-gradient(${color.start}, ${color.end})` }}>
      {children}
    </Card>
  );
}

export default PageBody;
