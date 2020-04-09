import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import superagent from 'superagent';
import Header from './header.js';
import Footer from './footer.js';
import Content from '../components/content.js';

import './style/site.scss';

const proxy = process.env.REACT_APP_GITHUB_PROXY;

export default function App() {
  const [content, setContent] = useState('');

  const getContent = async (repo, file, version) => {
    let url = `${proxy}/content`;
    let body = { repo, file, version };
    let response = await superagent.post(url).send(body);
    let markdown = response.text;
    setContent(markdown);
  };

  useEffect(() => {
    let qs = queryString.parse(window.location.search);
    if ( qs.repo && qs.file && qs.version ) {
      let version = qs.version || 'master';
      let repo = qs.repo.replace(/^\//, '');
      let file = qs.file.replace(/^\//, '');
      getContent(repo, file, version);
    }
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
