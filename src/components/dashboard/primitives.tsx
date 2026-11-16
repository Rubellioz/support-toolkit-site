import type { ReactNode } from 'react';
import { CircleCheck, CircleAlert, CircleX, Info, LoaderCircle } from 'lucide-react';
import type { Status } from '../../data/types';

const tone: Record<Status, string> = {
  ok: 'text-ok bg-ok-50',
  warn: 'text-warn bg-warn-50',
  bad: 'text-bad bg-bad-50',
  info: 'text-blue bg-blue-50',
  pending: 'text-muted bg-line-2',
};

export function Pill({ status, children, className = '' }: { status: Status; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium ${tone[status]} ${className}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function StatusIcon({ status, size = 15 }: { status: Status; size?: number }) {
  const props = { size, strokeWidth: 2.2, 'aria-hidden': true } as const;
  switch (status) {
    case 'ok':
      return <CircleCheck {...props} className="shrink-0 text-ok" />;
    case 'warn':
      return <CircleAlert {...props} className="shrink-0 text-warn" />;
    case 'bad':
      return <CircleX {...props} className="shrink-0 text-bad" />;
    case 'pending':
      return <LoaderCircle {...props} className="spin shrink-0 text-subtle" />;
    default:
      return <Info {...props} className="shrink-0 text-blue" />;
  }
}

export function Card({
  title,
  action,
  children,
  className = '',
  ...rest
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
} & Record<`data-${string}`, string | boolean | undefined>) {
  return (
    <section className={`dash-card flex flex-col ${className}`} {...rest}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-line-2 px-4 py-3">
          <p className="text-[13px] font-semibold tracking-[-0.01em]">{title}</p>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHead({ crumb, title, children }: { crumb: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p className="text-[11.5px] font-medium text-subtle">{crumb}</p>
        <p className="mt-0.5 text-[22px] font-semibold tracking-[-0.03em]">{title}</p>
      </div>
      {children}
    </div>
  );
}

/** Mock text input with an action button, as used by the lookup tools. */
export function QueryBar({ icon, value, action }: { icon: ReactNode; value: string; action: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-[340px] items-center gap-2 rounded-[10px] border border-line bg-white px-3 shadow-[var(--shadow-card)]">
        <span className="text-subtle">{icon}</span>
        <span className="mono truncate text-ink-2">{value}</span>
        <span className="ml-auto h-4 w-px bg-blue" />
      </div>
      <span className="flex h-9 items-center rounded-[10px] bg-blue px-3.5 text-[12.5px] font-semibold text-white shadow-[0_6px_14px_-6px_rgb(23_101_245/0.7)]">
        {action}
      </span>
    </div>
  );
}
