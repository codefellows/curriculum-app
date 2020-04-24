import React, { useContext, useEffect, useCallback } from 'react';

import ReactMarkdown from 'react-markdown';
import sectionize from 'remark-sectionize';

// Rendering overrides
import CodeBlock from './code.js';
import Section from './sections.js';
import Heading from './headings.js';

// Custom Remark Plugin
import toc from './plugins/toc.js';

// Context
import { CurriculumContext } from '../../context/curriculum.js';
import './toc.scss';

function Content(props) {

  const curriculum = useContext(CurriculumContext);

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
        e.preventDefault();
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
  }, [curriculum.markdown, observer]);

  return (
    <article id='courseContent' className='content'>
      <ReactMarkdown
        source={curriculum.markdown}
        renderers={{ code: CodeBlock, section: Section, heading: Heading }}
        plugins={[toc,sectionize]}
      />
    </article>
  );
}

export default Content;
