export function Header({
  profile,
  notificationOpen,
  setNotificationOpen,
  onProfile,
}: {
  profile: { nickname: string; tier: string; nexon: boolean };
  notificationOpen: boolean;
  setNotificationOpen: (value: boolean) => void;
  onProfile: () => void;
}) {
  return (
    <header className="h-[78px] max-w-[1180px] mx-auto px-7 flex items-center justify-between border-b border-accent/18">
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
        <div className="relative">
          <button
            aria-label="알림"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="w-9.5 h-9.5 rounded-full border border-white/14 bg-surface text-accent text-xs"
          >
            ●
          </button>
          {notificationOpen && (
            <div className="absolute right-0 top-12 w-64 p-4 border border-white/10 bg-surface z-10">
              <b className="block mb-2">새 알림 3개</b>
              <p className="text-muted text-xs mb-1">고티어 인증 신청이 접수됐어요.</p>
              <p className="text-muted text-xs mb-1">그룹에 새 메시지가 도착했어요.</p>
              <p className="text-muted text-xs">오늘의 기록을 남겨보세요.</p>
            </div>
          )}
        </div>
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