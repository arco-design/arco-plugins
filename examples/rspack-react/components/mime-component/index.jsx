import React from 'react';
import { Breadcrumb } from '@arco-design/web-react';

export function MimeComponent() {
  return (
    <div>
      <p>mime component</p>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#">Channel</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>News</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}
