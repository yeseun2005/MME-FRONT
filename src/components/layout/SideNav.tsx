import { NavLink } from 'react-router-dom';
import { navItems } from '../../constants/nav';

export function SideNav() {
  return (
    <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0 pt-4">
      <p className="text-muted text-[10px] font-extrabold tracking-[0.2em] mb-3 px-3">NAVIGATION</p>
      {navItems.map((item, index) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) =>
            isActive
              ? 'flex items-center gap-3 px-3 py-3 bg-accent text-ink font-extrabold text-left no-underline'
              : 'flex items-center gap-3 px-3 py-3 bg-transparent text-paper/80 hover:bg-white/5 text-left no-underline'
          }
        >
          <span>{item.glyph}</span>
          <b className="flex-1">{item.label}</b>
          <i className="not-italic text-[10px] opacity-60">0{index + 1}</i>
        </NavLink>
      ))}
      <div className="mt-auto pt-10 px-3 text-muted text-[10px] leading-relaxed">
        <b className="block text-paper">
          PLAY.
          <br />
          RECORD.
          <br />
          CONNECT.
        </b>
        <span>MMe / 2026</span>
      </div>
    </aside>
  );
}