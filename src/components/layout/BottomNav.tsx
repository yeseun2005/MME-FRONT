import { navItems } from '../../constants/nav';
import type { View } from '../../types';

export function BottomNav({ view, setView }: { view: View; setView: (view: View) => void }) {
  return (
    <nav
      aria-label="주요 메뉴"
      className="lg:hidden fixed left-1/2 bottom-4.5 z-20 w-[min(720px,calc(100%-28px))] h-[70px] p-1.5 grid grid-cols-5 -translate-x-1/2 border border-white/10 bg-[#121216]/92 shadow-2xl backdrop-blur-lg"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={
            view === item.id
              ? 'bg-accent text-ink text-[11px] font-bold'
              : 'bg-transparent text-[#888891] text-[11px] font-bold'
          }
        >
          <span className="block mb-1 text-sm">{item.glyph}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}