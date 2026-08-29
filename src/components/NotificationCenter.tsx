import type { AppNotification } from '../types/notification';
import type { View } from '../types';

export function NotificationCenter({
  notifications,
  unreadCount,
  open,
  onToggle,
  onSelect,
  onMarkAllRead,
}: {
  notifications: AppNotification[];
  unreadCount: number;
  open: boolean;
  onToggle: () => void;
  onSelect: (view: View) => void;
  onMarkAllRead: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-label="알림"
        className="relative w-10 h-10 grid place-items-center border border-white/10 bg-surface-2 text-paper"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 grid place-items-center bg-accent text-ink text-[9px] font-black">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-40 w-80 max-h-96 overflow-auto border border-white/10 bg-surface text-paper shadow-2xl max-[420px]:w-[calc(100vw-32px)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <b className="text-[11px] tracking-widest text-muted">알림</b>
            <button onClick={onMarkAllRead} className="text-accent text-[11px] font-bold">
              모두 읽음
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="p-6 text-center text-muted text-[12px]">새 알림이 없습니다.</p>
          ) : (
            notifications.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.targetView)}
                className={`block w-full text-left px-4 py-3 border-b border-white/5 ${
                  item.read ? 'opacity-60' : ''
                }`}
              >
                <p className="text-accent text-[10px] font-extrabold tracking-widest">{item.type}</p>
                <p className="text-paper text-[13px] font-bold">{item.title}</p>
                <p className="text-muted text-[11px]">{item.body}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}