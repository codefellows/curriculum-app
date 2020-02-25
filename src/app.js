import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import superagent from 'superagent';
import Header from './header.js';
import Footer from './footer.js';
import Content from './content.js';

import './style/site.scss';

// Needs to be deployed
const proxy = process.env.REACT_APP_GITHUB_PROXY;
console.log(proxy);

export default function App() {
  const [content, setContent] = useState('');

  const getContent = async (repo, file, version) => {
    let body = { repo, file, version };
    let response = await superagent.post(proxy).send(body);
    let markdown = response.text;
    setContent(markdown);
  };

  useEffect(() => {
    let qs = queryString.parse(window.location.search);
    let version = qs.version || 'master';
    let repo = qs.repo.replace(/^\//, '');
    let file = qs.file.replace(/^\//, '');
    getContent(repo, file, version);
  });

  return (
    <>
      <Header />
      <main>
        <Content markdown={content} />
      </main>
      <Footer />
    </>
  );
}
