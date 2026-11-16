import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import './styles/index.css';
import { App } from './App';
import { site } from './config/site';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The build prerenders the page into #root (scripts/prerender.mjs); hydrate when markup is present.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);

// Optional analytics: loaded after first paint, domain resolved at runtime (migration-proof).
if (site.analyticsSrc) {
  window.addEventListener('load', () => {
    const s = document.createElement('script');
    s.src = site.analyticsSrc;
    s.defer = true;
    s.dataset.domain = window.location.hostname;
    document.head.appendChild(s);
  });
}
