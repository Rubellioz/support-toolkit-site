import { LANGS, langPath, type Lang } from '../../i18n/lang';
import { useLang, useT } from '../../i18n/context';
import { getCurrentAnchor } from '../../lib/tourNav';
import { cn } from '../../lib/cn';

const short: Record<Lang, string> = { nl: 'NL', en: 'EN' };
const names: Record<Lang, string> = { nl: 'Nederlands', en: 'English' };

/**
 * NL | EN switch. Each language is its own page ("/" and "/en/"); switching keeps the visitor's place
 * by carrying the anchor of the chapter currently on screen.
 */
export function LanguageSwitch({ className = '' }: { className?: string }) {
  const lang = useLang();
  const t = useT();
  return (
    <div role="group" aria-label={t.header.language} className={cn('flex items-center rounded-full border border-line bg-white/80 p-0.5 text-[12.5px] font-semibold', className)}>
      {LANGS.map((l) =>
        l === lang ? (
          <span key={l} aria-current="true" aria-label={`${short[l]}: ${names[l]}`} className="grid h-8 min-w-9 place-items-center rounded-full bg-ink px-2.5 text-white">
            {short[l]}
          </span>
        ) : (
          <a
            key={l}
            href={langPath(l)}
            hrefLang={l}
            lang={l}
            aria-label={`${short[l]}: ${t.header.switchTo}`}
            className="grid h-8 min-w-9 place-items-center rounded-full px-2.5 text-muted transition-colors hover:text-ink"
            onClick={(e) => {
              e.preventDefault();
              const anchor = getCurrentAnchor();
              window.location.href = langPath(l) + (anchor ? `#${anchor}` : '');
            }}
          >
            {short[l]}
          </a>
        ),
      )}
    </div>
  );
}
