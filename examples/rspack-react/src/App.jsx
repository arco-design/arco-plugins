import React, { useEffect, useState } from 'react';
import { Button, Space, Upload } from '@arco-design/web-react';
import { IconUser } from '@arco-design/web-react/icon';
import ky from 'ky';

function App() {
  const [usingWoff, setUsingWoff] = useState('loading');
  useEffect(() => {
    ky('/main.css')
      .text()
      .then((content) => {
        const matched = content.match(/url\(.*?nunito_for_arco.*?\)/);
        if (matched) {
          setUsingWoff(matched[0]);
        } else {
          setUsingWoff('EMPTY');
        }
      });
  });
  return (
    <div style={{ padding: 20 }}>
      <ol>
        <Space direction="vertical" size="large">
          <li>
            <p>The button should be the Christmas style (theme: '@arco-design/theme-christmas'):</p>
            <Button type="primary">Button</Button>
          </li>
          <li>
            <p>The nunito font file should not exist (removeFontFace: true for &lt;= 2.23.0):</p>
            <pre>{usingWoff}</pre>
          </li>
          <li>
            <p>This upload component should display Japanese (defaultLanguage: 'ja-JP'):</p>
            <Upload />
          </li>
          <li>
            <p>
              This icon should display the logo of Tiktok (iconBox:
              '@arco-iconbox/react-partial-bits'):
            </p>
            <IconUser style={{ fontSize: 40 }} />
          </li>
        </Space>
      </ol>
    </div>
  );
}

export default App;
