import React from 'react';
import Header from './header.js';
import Footer from './footer.js';
import Content from '../components/content.js';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Content />
      </main>
      <Footer />
    </>
  );
}
