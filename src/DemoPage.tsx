import React from 'react';
import AppDemo from './AppDemo';

/**
 * DemoPage – a simple wrapper that renders the GSAP demo component.
 * It is loaded via React Router at the "/example" path.
 */
export default function DemoPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>GSAP Demo</h2>
      <AppDemo />
    </div>
  );
}
