import React from 'react';
import { Button, Space } from '@arco-design/web-react';
import { ComponentA } from 'example-component-a';

function App() {
  return (
    <div style={{ padding: 20 }}>
      <Space direction="vertical">
        <ol>
          <li>
            button should looks yellow
            <Button type="primary">Button</Button>
          </li>
          <li>
            button should looks yellow
            <ComponentA />
          </li>
        </ol>
      </Space>
    </div>
  );
}

export default App;
