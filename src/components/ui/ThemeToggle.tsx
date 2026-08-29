import type { Theme } from '../../hooks/useTheme';

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="화면 모드 전환"
      className="h-10 px-4 border border-white/10 bg-surface-2 text-paper text-[11px] font-extrabold tracking-wide"
    >
      {theme === 'dark' ? '🌙 다크 모드' : '☀️ 라이트 모드'}
    </button>
  );
}