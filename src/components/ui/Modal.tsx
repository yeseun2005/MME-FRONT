import type { ReactNode } from 'react';

export function Modal({
  children,
  onClose,
  label,
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
}) {
  return (
    <div
      className="fixed inset-0 z-30 grid place-items-center p-5 overflow-auto bg-black/72 backdrop-blur-md max-[760px]:p-0 max-[760px]:items-end"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onMouseDown={(event) => event.stopPropagation()}
        className="relative w-[min(660px,100%)] max-h-[calc(100dvh-56px)] overflow-auto p-9 border border-accent/32 bg-[#151519] shadow-2xl max-[760px]:w-full max-[760px]:max-h-[92dvh] max-[760px]:p-6"
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-5 top-4 z-10 border-0 bg-transparent text-muted text-3xl leading-none cursor-pointer"
        >
          ×
        </button>
        {children}
      </section>
    </div>
  );
}