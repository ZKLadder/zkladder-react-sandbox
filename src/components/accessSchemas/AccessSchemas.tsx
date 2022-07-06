import React from 'react';
import { useRecoilValue } from 'recoil';
import SchemaList from './SchemaList';
import SchemaBuilder from './SchemaBuilder';
import { schemaPageState } from '../../state/page';

function AccessSchemas() {
  const { section } = useRecoilValue(schemaPageState);

  if (section === 'list') {
    return <SchemaList />;
  }

  return <SchemaBuilder />;
}

export default AccessSchemas;
