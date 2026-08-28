export function ChatPanel({
  title,
  messages,
  input,
  setInput,
  send,
  close,
}: {
  title: string;
  messages: string[];
  input: string;
  setInput: (value: string) => void;
  send: () => void;
  close: () => void;
}) {
  return (
    <aside className="fixed right-4 bottom-4 z-40 w-80 h-[480px] flex flex-col border border-white/10 bg-surface shadow-2xl max-[760px]:right-1.5 max-[760px]:bottom-1.5 max-[760px]:w-[calc(100%-12px)] max-[760px]:h-[calc(100dvh-12px)]">
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <div>
            <b className="block">{title}</b>
            <small className="text-muted text-xs">지금 대화 가능</small>
          </div>
        </div>
        <button onClick={close} className="text-muted text-xl">
          ×
        </button>
      </header>

      <div className="flex-1 overflow-auto p-4 grid gap-3 content-start">
        <p className="text-center text-muted text-[10px] tracking-widest">TODAY</p>
        {messages.map((message, index) => (
          <div
            key={`${message}-${index}`}
            className={`flex items-start gap-2 ${index > 1 ? 'flex-row-reverse text-right' : ''}`}
          >
            <span className="w-6 h-6 shrink-0 rounded-full bg-white/10 grid place-items-center text-[9px] font-bold">
              {index > 1 ? 'MP' : 'CO'}
            </span>
            <p
              className={`max-w-[70%] px-3 py-2 text-sm ${
                index > 1 ? 'bg-accent text-ink' : 'bg-surface-2 text-paper'
              }`}
            >
              {message}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-3 border-t border-white/10">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && send()}
          placeholder="메시지를 입력하세요"
          className="flex-1 h-10 px-3 border border-white/10 bg-surface-2 text-paper outline-none focus:border-accent/60"
        />
        <button onClick={send} className="w-10 h-10 grid place-items-center bg-accent text-ink font-bold">
          ↑
        </button>
      </div>
    </aside>
  );
}