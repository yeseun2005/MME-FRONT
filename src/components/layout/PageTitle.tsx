import type { ReactNode } from 'react';

export function PageTitle({
  eyebrow,
  title,
  accent,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8 max-[760px]:flex-wrap max-[760px]:items-center">
      <div>
        <p className="text-accent text-[11px] font-extrabold tracking-[0.2em] mb-2.5">{eyebrow}</p>
        <h1 className="m-0 font-black uppercase break-keep leading-[1.15] tracking-tight text-[clamp(28px,5.5vw,52px)]">
          {title} {accent && <em className="text-accent not-italic">{accent}</em>}
        </h1>
        <p className="mt-3 text-muted max-w-[520px] break-keep">{description}</p>
      </div>
      {action}
    </div>
  );
}