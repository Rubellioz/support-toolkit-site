import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_LANG, type Lang } from './lang';
import { messages, type Messages } from './messages';

const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
export const useT = (): Messages => messages[useContext(LangContext)];
