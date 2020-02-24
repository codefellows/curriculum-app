import React, { useState, useEffect } from 'react';

import slug from 'remark-slug';
import autolink from 'remark-autolink-headings';
import remark from 'remark';
import sectionize from 'remark-sectionize';
import html from 'remark-html';
import ReactHtmlParser from 'react-html-parser';

import toc from './plugins/toc.js';



export default props => {

  const { markdown } = props;
  const [markup, setMarkup] = useState('');

  useEffect(() => {

    const content = remark()
      .use(slug)
      .use(toc, { maxDepth: 3 })
      .use(autolink)
      .use(sectionize)
      .use(html)
      .processSync(markdown)
      .toString();

    setMarkup(content);

  }, [markdown]);

  return (
    <article>
      {ReactHtmlParser(markup)}
    </article>
  );
};
