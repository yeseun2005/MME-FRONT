export function Tabs<T extends string>({
  items,
  active,
  onChange,
  labelOf,
}: {
  items: readonly T[];
  active: T;
  onChange: (value: T) => void;
  labelOf?: (item: T) => string;
}) {
  return (
    <div className="flex gap-1.5 overflow-auto">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={
            active === item
              ? 'min-w-16 h-9 px-3.5 shrink-0 border border-accent bg-accent text-ink text-[10px] font-extrabold'
              : 'min-w-16 h-9 px-3.5 shrink-0 border border-white/10 bg-transparent text-[#7c7c85] text-[10px] font-extrabold'
          }
        >
          {labelOf ? labelOf(item) : item}
        </button>
      ))}
    </div>
  );
}