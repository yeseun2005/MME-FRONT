import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationCenter } from '../NotificationCenter';
import type { Theme } from '../../hooks/useTheme';
import type { AppNotification } from '../../types/notification';
import type { View } from '../../types';

export function Header({
  profile,
  onProfile,
  theme,
  onToggleTheme,
  notifications,
  unreadCount,
  notifOpen,
  onToggleNotif,
  onSelectNotif,
  onMarkAllRead,
}: {
  profile: { nickname: string; tier: string; nexon: boolean };
  onProfile: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  notifications: AppNotification[];
  unreadCount: number;
  notifOpen: boolean;
  onToggleNotif: () => void;
  onSelectNotif: (view: View) => void;
  onMarkAllRead: () => void;
}) {
  return (
    <header className="h-[78px] w-full max-w-[1600px] mx-auto px-8 flex items-center justify-between border-b border-accent/18">
      <a href="#top" className="flex items-center gap-3 text-inherit no-underline">
        <span className="w-11 h-11 grid place-items-center bg-accent text-ink font-black italic -tracking-widest [clip-path:polygon(7%_8%,100%_0,93%_92%,0_100%)]">
          MM
        </span>
        <span>
          <strong className="block text-lg tracking-wide">MMe</strong>
          <small className="block text-muted text-[9px] tracking-[0.26em]">MADMAKER</small>
        </span>
      </a>

      <div className="hidden md:flex items-center gap-2 text-[11px] text-muted">
        <span className="w-2 h-2 rounded-full bg-accent" />
        DEMO · LOCAL STORAGE
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <NotificationCenter
          notifications={notifications}
          unreadCount={unreadCount}
          open={notifOpen}
          onToggle={onToggleNotif}
          onSelect={onSelectNotif}
          onMarkAllRead={onMarkAllRead}
        />

        <button onClick={onProfile} className="flex items-center gap-2.5 bg-transparent">
          <span className="w-10.5 h-10.5 rounded-full border border-white/14 bg-surface grid place-items-center text-xs font-extrabold">
            MP
          </span>
          <span className="text-left hidden md:block">
            <b className="block">
              {profile.nickname} {profile.nexon && <i className="not-italic text-accent">✓</i>}
            </b>
            <small className="block text-muted">{profile.tier}</small>
          </span>
        </button>
      </div>
    </header>
  );
}