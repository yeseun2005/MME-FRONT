import { useState } from 'react';
import { heroImagePath, heroSlug } from '../../lib/heroImage';
import type { Hero } from '../../types';

function Initials({ label, className }: { label: string; className: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`grid place-items-center shrink-0 bg-surface-2 border border-white/10 text-muted text-[10px] font-black ${className}`}
    >
      {label.slice(0, 2)}
    </span>
  );
}

export function HeroImage({
  name,
  slug,
  heroes,
  className = '',
}: {
  name: string;
  slug?: string;
  heroes?: Hero[];
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = slug ?? (heroes ? heroSlug(heroes, name) : undefined);

  if (!resolved || failed) return <Initials label={name} className={className} />;

  return (
    <img
      src={heroImagePath(resolved)}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

export function CoachImage({
  nickname,
  src,
  className = '',
}: {
  nickname: string;
  src?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <Initials label={nickname} className={className} />;
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}