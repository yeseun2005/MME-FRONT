import { NavLink } from 'react-router-dom';
import { navItems } from '../../constants/nav';

export function BottomNav() {
  return (
    <nav
      aria-label="주요 메뉴"
      className="lg:hidden fixed left-1/2 bottom-4.5 z-20 w-[min(820px,calc(100%-28px))] h-[70px] p-1.5 grid grid-cols-6 -translate-x-1/2 border border-white/10 bg-[#121216]/92 shadow-2xl backdrop-blur-lg"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) =>
            isActive
              ? 'grid place-content-center bg-accent text-ink text-[11px] font-bold no-underline'
              : 'grid place-content-center bg-transparent text-[#888891] text-[11px] font-bold no-underline'
          }
        >
          <span className="block mb-1 text-sm text-center">{item.glyph}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}