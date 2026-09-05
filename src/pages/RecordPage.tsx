import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordView } from '../features/record/RecordView';
import { RecordModal } from '../features/record/modals/RecordModal';
import { useApp } from '../app/outlet-context';
import { buildCalendarCells, clampDay, dateKey, shiftMonth } from '../lib/date';
import type { RecordDraft, RecordMode } from '../types';

export function RecordPage() {
  const navigate = useNavigate();
  const { profile, heroes, records, saveRecord, deleteRecord, clearRecords, notify, pushNotification } = useApp();

  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());
  const [selectedMode, setSelectedMode] = useState<RecordMode>('경쟁전');
  const [recordOpen, setRecordOpen] = useState(false);
  const [recordDraft, setRecordDraft] = useState<RecordDraft>({
    kills: 0,
    assists: 0,
    deaths: 0,
    tier: '플래티넘 2',
    position: '돌격',
    hero: 'D.Va',
    memo: '',
    videoName: '',
    videoFile: null,
  });

  const selectedDate = dateKey(viewYear, viewMonth, selectedDay);
  const calendarDays = useMemo(() => buildCalendarCells(viewYear, viewMonth), [viewYear, viewMonth]);

  function goToMonth(delta: number) {
    const { year, month } = shiftMonth(viewYear, viewMonth, delta);
    setViewYear(year);
    setViewMonth(month);
    setSelectedDay((current) => clampDay(year, month, current));
  }

  function goToToday() {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth() + 1);
    setSelectedDay(now.getDate());
  }

  function openRecord(mode: RecordMode) {
    setSelectedMode(mode);
    const existing = records[`${selectedDate}-${mode}`];
    setRecordDraft(
      existing
        ? {
            kills: existing.kills,
            assists: existing.assists,
            deaths: existing.deaths,
            tier: mode === '빠른 대전' ? '언랭' : existing.tier,
            position: existing.position,
            hero: existing.hero,
            memo: existing.memo,
            videoName: existing.videoName || '',
            videoFile: null,
          }
        : {
            kills: 0,
            assists: 0,
            deaths: 0,
            tier: mode === '빠른 대전' ? '언랭' : profile.tier,
            position: profile.position,
            hero: profile.heroes[0],
            memo: '',
            videoName: '',
            videoFile: null,
          },
    );
    setRecordOpen(true);
  }

  function handleSaveRecord(event: FormEvent) {
    event.preventDefault();
    saveRecord(selectedDate, selectedMode, {
      kills: recordDraft.kills,
      assists: recordDraft.assists,
      deaths: recordDraft.deaths,
      tier: selectedMode === '빠른 대전' ? '언랭' : recordDraft.tier,
      position: recordDraft.position,
      hero: recordDraft.hero,
      memo: recordDraft.memo,
      videoName: recordDraft.videoName,
    });
    notify(`${selectedMode} 기록이 저장되었습니다.`, '기기에 안전하게 저장했습니다.');
    pushNotification('기록', `${selectedMode} 기록이 저장됐어요`, `${selectedDate} · ${recordDraft.hero}`, 'record');
    setRecordOpen(false);
  }

  return (
    <>
      <RecordView
        year={viewYear}
        month={viewMonth}
        onPrevMonth={() => goToMonth(-1)}
        onNextMonth={() => goToMonth(1)}
        onToday={goToToday}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        calendarDays={calendarDays}
        records={records}
        selectedDate={selectedDate}
        profile={profile}
        heroes={heroes}
        openRecord={openRecord}
        onDelete={(mode) => deleteRecord(selectedDate, mode)}
        onClear={clearRecords}
        onMeta={() => navigate('/record/meta')}
      />

      {recordOpen && (
        <RecordModal
          draft={recordDraft}
          setDraft={setRecordDraft}
          heroes={heroes}
          date={selectedDate}
          mode={selectedMode}
          onClose={() => setRecordOpen(false)}
          onSave={handleSaveRecord}
        />
      )}
    </>
  );
}