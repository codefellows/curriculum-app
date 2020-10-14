import React, { useState } from 'react';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import FileIcon from '@material-ui/icons/InsertDriveFileOutlined';
import FolderIconOpen from '@material-ui/icons/FolderOutlined';
import FolderIcon from '@material-ui/icons/FolderOpenOutlined';

import CodeBlock from '../content/renderers/code.js';

import './demo.scss';

function Demo({ tree }) {

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');

  const languages = {
    js: 'javascript',
    json: 'json',
    py: 'python',
    java: 'java',
    cs: 'csharp',
    html: 'html',
    cshtml: 'html',
    css: 'css',
    scss: 'css',
  };

  const showCode = (file, item) => {
    if (item.content) {
      let ext = file.split('.').pop();
      setLanguage(languages[ext]);
      setCode(item.content);
    }
  };

  const renderTree = ({ ...item }) => {
    return Object.keys(item).reduce((list, key) => {
      if (typeof item[key] === 'object') {
        const newItem = (
          <TreeItem
            nodeId={key}
            key={key}
            label={key}
            onClick={() => showCode(key, item[key])}
          >
            {renderTree(item[key])}
          </TreeItem>
        );
        list.push(newItem);
      }
      return list;
    }, []);
  };

  return (
    <section className="demo">
      <TreeView
        defaultExpandIcon={<FolderIcon style={{ color: 'orange' }} />}
        defaultCollapseIcon={<FolderIconOpen style={{ color: 'orange' }} />}
        defaultEndIcon={<FileIcon style={{ color: '#888' }} />}
      >
        {tree && tree.files && renderTree(tree.files)}
      </TreeView>
      <div className="code">
        <CodeBlock customStyle="demo" theme="tomorrow" language={language} value={code} />
      </div>
    </section>
  );

}

export default Demo;
