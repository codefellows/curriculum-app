import React, { useContext, useEffect } from 'react';

import ReactMarkdown from 'react-markdown';
import sectionize from 'remark-sectionize';

// Markdown rendering overrides
import CodeBlock from './code.js';
import Link from './links.js';
import Section from './sections.js';
import Heading from './headings.js';

// Custom Remark Plugin to handle the Table of Contents
import toc from './plugins/toc.js';

// Custom Components
import {If,Then,Else} from '../if';
import Demo from '../demo/demo.js';

// Context
import { CurriculumContext } from '../../context/curriculum.js';

// Custom Styles
import './toc.scss';
import './table.scss';

function Content(props) {

  const curriculum = useContext(CurriculumContext);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.intersectionRatio > 0) {
        let items = document.querySelectorAll('.content a');
        items.forEach( item => item && item.classList.remove('active') );
        let a = document.querySelector(`a[href$="${id}"]`);
        a && a.classList.add('active');
      }
    });
  });

  useEffect( () => {
    document.querySelectorAll('section h2[id]').forEach((section) => { observer.observe(section); });
    document.querySelectorAll('section h3[id]').forEach((section) => { observer.observe(section); });
    document.querySelectorAll('section h4[id]').forEach((section) => { observer.observe(section); });
  }, [curriculum.markdown, observer]);

  return (
    <If condition={curriculum.demoMode}>
      <Then>
        <Demo tree={curriculum.demoFiles}/>
      </Then>
      <Else>
        <article id='courseContent' className='content'>
          <ReactMarkdown
            source={curriculum.markdown}
            renderers={{
              link: Link,
              code: CodeBlock,
              heading: Heading,
              section: Section,
            }}
            plugins={[toc, sectionize]}
          />
        </article>
      </Else>
    </If>

  );
}

export default Content;
