import React, { useState, useContext, useEffect } from 'react';

import slug from 'remark-slug';
import autolink from 'remark-autolink-headings';
import remark from 'remark';
import sectionize from 'remark-sectionize';
import html from 'remark-html';
import ReactHtmlParser from 'react-html-parser';

import {CurriculumContext} from '../context/curriculum.js';
import toc from '../plugins/toc.js';

function Content(props) {

  const curriculum = useContext(CurriculumContext);
  // const { markdown } = props;
  const [markup, setMarkup] = useState('');

  useEffect(() => {

    const content = remark()
      .use(slug)
      .use(toc, { maxDepth: 3 })
      .use(autolink)
      .use(sectionize)
      .use(html)
      .processSync(curriculum.markdown)
      .toString();

    setMarkup(content);

  }, [curriculum.markdown]);

  return (
    <article>
      {ReactHtmlParser(markup)}
    </article>
  );
}

export default Content;
