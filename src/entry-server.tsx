import { renderToString } from 'react-dom/server';
import { App } from './App';
import type { Lang } from './i18n/lang';

export { renderHead } from './seo/head';
export { LANGS, langPath } from './i18n/lang';

/** Used at build time only (scripts/prerender.mjs) to emit static HTML per language. */
export function render(lang: Lang) {
  return renderToString(<App lang={lang} />);
}
