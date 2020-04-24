import React, { useState, useContext, useEffect, useCallback } from 'react';

import slug from 'remark-slug';
import remark from 'remark';
import sectionize from 'remark-sectionize';
import html from 'remark-html';
import ReactHtmlParser from 'react-html-parser';

import { CurriculumContext } from '../context/curriculum.js';
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
        items.forEach( item => item && item.classList.remove('active') );
        let a = document.querySelector(`a[href="#${id}"]`);
        a && a.classList.add('active');
      }
    });
  });

  // By wrapping in a callback, we can memoize this for the effect
  const interceptHrefClicks = useCallback( (e) => {
    if (e.target.nodeName === 'A') {

      const href = e.target.getAttribute('href');

      // Absolute? Open in new tab
      if (href.startsWith('http')) {
        e.preventDefault();
        window.open(href, '_blank');
      }
      // Hash Link
      else if (href.startsWith('#')) {}
      // Relative? Change the state with the new filename
      else {
        const url = new URL(href, `http://x${curriculum.file}`);
        console.log(curriculum.file);
        console.log(href);
        console.log(url);
        curriculum.selectPage(url.pathname);
      }
    }
  });

  useEffect( () => {
    const content = document.getElementById('courseContent');
    content.addEventListener('click', interceptHrefClicks);
    return () => content.removeEventListener('click', interceptHrefClicks);
  }, [interceptHrefClicks]);

  useEffect( () => {
    document.querySelectorAll('section h2[id]').forEach((section) => { observer.observe(section); });
    document.querySelectorAll('section h3[id]').forEach((section) => { observer.observe(section); });
    document.querySelectorAll('section h4[id]').forEach((section) => { observer.observe(section); });
  }, [markup, observer]);

  // The actual renderer, fires on page change
  useEffect(() => {

    const content = remark()
      .use(slug)
      .use(toc, { maxDepth: 3 })
      .use(sectionize)
      .use(html)
      .processSync(curriculum.markdown)
      .toString();

    setMarkup(content);


  }, [curriculum.markdown]);

  // Use CSS Module to do the floating TOC
  // i.e. https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/
  return (
    <article id='courseContent' className='content'>
      {ReactHtmlParser(markup)}
    </article>
  );
}

export default Content;


