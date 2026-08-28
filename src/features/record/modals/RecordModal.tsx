import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { FormField, FormGrid } from '../../../components/ui/FormField';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { tierOptions } from '../../../constants/tiers';
import type { Hero, RecordDraft, RecordMode } from '../../../types';
import { HeroSelect } from '../../../components/ui/HeroSelect';

export function RecordModal({
  draft,
  setDraft,
  heroes,
  date,
  mode,
  onClose,
  onSave,
}: {
  draft: RecordDraft;
  setDraft: Dispatch<SetStateAction<RecordDraft>>;
  heroes: Hero[];
  date: string;
  mode: RecordMode;
  onClose: () => void;
  onSave: (event: FormEvent) => void;
}) {
  return (
    <Modal onClose={onClose} label="게임 기록 작성">
      <form onSubmit={onSave} className="grid gap-4.5">
        <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">
          NEW BATTLE RECORD · {date}
        </p>
        <h2 className="text-3xl font-black -tracking-wide">{mode} 기록</h2>

        <div className="flex items-center justify-between px-4 py-3 border border-white/10 bg-surface-2">
          <span className="text-muted text-[10px] font-extrabold tracking-widest">
            {mode === '경쟁전' ? 'COMPETITIVE' : 'QUICK PLAY'}
          </span>
          <b>{mode}</b>
        </div>

        {mode === '빠른 대전' && (
          <p className="text-muted text-xs">
            <b className="text-paper">UNRANKED</b> 빠른 대전은 티어를 기록하지 않아요.
          </p>
        )}

        <div className="grid grid-cols-3 gap-3">
          {(
            [
              ['kills', 'KILL'],
              ['assists', 'ASSIST'],
              ['deaths', 'DEATH'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="p-4 border border-white/10 bg-surface-2">
              <span className="block text-accent text-[10px] font-extrabold tracking-widest">{label}</span>
              <input
                type="number"
                min="0"
                value={draft[key]}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [key]: Number(event.target.value) }))
                }
                className="w-full mt-2.5 bg-transparent outline-none text-paper text-[34px] leading-none"
              />
            </label>
          ))}
        </div>

        <FormGrid single={mode === '빠른 대전'}>
          {mode === '경쟁전' && (
            <FormField label="티어">
              <Select
                value={draft.tier}
                onChange={(event) => setDraft((current) => ({ ...current, tier: event.target.value }))}
              >
                {tierOptions.map((tier) => (
                  <option key={tier}>{tier}</option>
                ))}
              </Select>
            </FormField>
          )}
          <FormField label="포지션">
            <Select
              value={draft.position}
              onChange={(event) => setDraft((current) => ({ ...current, position: event.target.value }))}
            >
              {['돌격', '공격', '지원'].map((position) => (
                <option key={position}>{position}</option>
              ))}
            </Select>
          </FormField>
        </FormGrid>

        <FormField label="플레이 영웅">
            <HeroSelect
                heroes={heroes}
                value={draft.hero}
                onChange={(name) => setDraft((current) => ({ ...current, hero: name }))}
            />
        </FormField>

        <FormField label="한 줄 메모">
          <Textarea
            value={draft.memo}
            onChange={(event) => setDraft((current) => ({ ...current, memo: event.target.value }))}
            placeholder="오늘의 플레이에서 기억할 점"
          />
        </FormField>

        <label className="grid place-items-center gap-1 min-h-[120px] p-5 border border-dashed border-accent/40 cursor-pointer">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file)
                setDraft((current) => ({
                  ...current,
                  videoName: file.name,
                  videoUrl: URL.createObjectURL(file),
                  videoFile: file,
                }));
            }}
          />
          <span className="text-accent text-3xl">＋</span>
          <b className="text-paper text-[11px]">{draft.videoName || '최고의 플레이 영상 추가'}</b>
          <small className="text-[#707078] text-[8px]">저장하면 Firebase Storage에 안전하게 업로드됩니다.</small>
        </label>

        <Button type="submit" variant="primary" size="wide" icon="✓">
          기록 저장하기
        </Button>
      </form>
    </Modal>
  );
}