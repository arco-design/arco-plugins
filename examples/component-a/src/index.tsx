import React from 'react';
import { Statistic } from '@arco-design/web-react';

export function ComponentA() {
  return (
    <div style={{ padding: 20 }}>
      <p>I am ComponentA</p>
      <Statistic title="Downloads" value={125670} groupSeparator style={{ marginLeft: 60 }} />
    </div>
  );
}
