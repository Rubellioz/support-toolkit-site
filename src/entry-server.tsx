import { renderToString } from 'react-dom/server';
import { App } from './App';

/** Used at build time only (scripts/prerender.mjs) to emit static HTML for SEO and fast first paint. */
export function render() {
  return renderToString(<App />);
}
