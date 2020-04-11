import React, { useState, useCallback, useContext, useEffect } from 'react';

import slug from 'remark-slug';
import autolink from 'remark-autolink-headings';
import remark from 'remark';
import sectionize from 'remark-sectionize';
import html from 'remark-html';
import ReactHtmlParser from 'react-html-parser';

import {CurriculumContext} from '../context/curriculum.js';
import toc from '../plugins/toc.js';

import './toc.scss';

function Content(props) {

  const curriculum = useContext(CurriculumContext);
  const [markup, setMarkup] = useState('');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.intersectionRatio > 0) {
        let items = document.querySelectorAll('.content a');
        items.forEach( item => item.classList.remove('active') );
        document.querySelector(`a[href="#${id}"]`).classList.add('active');
      }
    });
  });

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

  useEffect( () => {
    document.querySelectorAll('section h2[id]').forEach((section) => { observer.observe(section); });
    document.querySelectorAll('section h3[id]').forEach((section) => { observer.observe(section); });
    document.querySelectorAll('section h4[id]').forEach((section) => { observer.observe(section); });

  }, [markup, observer]);

  // Use CSS Module to do the floating TOC
  // i.e. https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/
  return (
    <article className='content'>
      {ReactHtmlParser(markup)}
    </article>
  );
}

export default Content;


