/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_ANALYTICS_SRC?: string;
  readonly VITE_NOINDEX?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
