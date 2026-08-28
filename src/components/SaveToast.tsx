import type { SaveNotice } from '../types';

export function SaveToast({ notice, onClose }: { notice: SaveNotice; onClose: () => void }) {
  return (
    <aside
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed right-5 bottom-5 z-40 flex items-start gap-3 max-w-sm p-4 border border-accent/40 bg-surface shadow-2xl"
    >
      <span className="text-accent font-black">✓</span>
      <div>
        <small className="block text-accent text-[9px] font-extrabold tracking-widest">SAVE COMPLETE</small>
        <b className="block">{notice.title}</b>
        <p className="text-muted text-xs mt-1">{notice.detail}</p>
      </div>
      <button onClick={onClose} aria-label="저장 알림 닫기" className="ml-auto text-muted text-lg">
        ×
      </button>
    </aside>
  );
}