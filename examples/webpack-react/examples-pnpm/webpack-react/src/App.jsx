import React from 'react';
import {
  Space,
  Button,
  DatePicker,
  Avatar,
  Input,
  Tag,
  Slider,
  Switch,
  Rate,
  Empty,
} from '@arco-design/web-react';
import ProRadio from 'arco-pro-radio';

function App() {
  return (
    <div style={{ padding: 20 }}>
      <Space direction="vertical">
        <Button type="primary">Button</Button>
        <DatePicker />
        <Avatar>Arco</Avatar>
        <Input />
        <Tag>Tag</Tag>
        <Slider />
        <Switch />
        <Rate />
        <Empty />
        <Space>
          <ProRadio value="A" checked>
            A
          </ProRadio>
          <ProRadio value="B">B</ProRadio>
          <ProRadio value="C">C</ProRadio>
        </Space>
      </Space>
    </div>
  );
}

export default App;
