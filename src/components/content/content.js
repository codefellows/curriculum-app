import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import ReactMarkdown from 'react-markdown';
import sectionize from 'remark-sectionize';

// Markdown rendering overrides
import CodeBlock from './renderers/code.js';
import Link from './renderers/links.js';
import Image from './renderers/images.js';
import Section from './renderers/sections.js';
import Heading from './renderers/headings.js';

// Custom Remark Plugin to handle the Table of Contents
import toc from './plugins/toc.js';

// Custom Components
import { If, Then, Else } from '../if';
import Demo from '../demo/demo.js';

// Custom Styles
import './toc.scss';
import './table.scss';

function Content({ curriculum }) {

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.intersectionRatio > 0) {
        let items = document.querySelectorAll('.content a');
        items.forEach(item => item && item.classList.remove('active'));
        let a = document.querySelector(`a[href$="${id}"]`);
        a && a.classList.add('active');
      }
    });
  });

  useEffect(() => {
    document.querySelectorAll('section h2[id]').forEach((section) => { observer.observe(section); });
    document.querySelectorAll('section h3[id]').forEach((section) => { observer.observe(section); });
    document.querySelectorAll('section h4[id]').forEach((section) => { observer.observe(section); });
  }, [curriculum.markdown, observer]);

  return (
    <If condition={curriculum.demoMode}>
      <Then>
        <Demo tree={curriculum.demoFiles} />
      </Then>
      <Else>
        <article id='courseContent' className='content'>
          <ReactMarkdown
            source={curriculum.markdown}
            escapeHtml={false}
            renderers={{
              link: Link,
              image: Image,
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

const mapStateToProps = ({ curriculum }) => ({ curriculum });

export default connect(mapStateToProps)(Content);
