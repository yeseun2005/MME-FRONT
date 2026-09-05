import { PageTitle } from '../../components/layout/PageTitle';
import { Button } from '../../components/ui/Button';
import { HeroImage } from '../../components/ui/HeroImage';
import { MONTH_LABELS_EN, dateKey, daysInMonth, isSameDate } from '../../lib/date';
import type { GameRecord, Hero, Profile, RecordMode } from '../../types';

export function RecordView({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
  selectedDay,
  setSelectedDay,
  calendarDays,
  records,
  selectedDate,
  profile,
  heroes,
  openRecord,
  onDelete,
  onClear,
  onMeta,
}: {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  calendarDays: number[];
  records: Record<string, GameRecord>;
  selectedDate: string;
  profile: Profile;
  heroes: Hero[];
  openRecord: (mode: RecordMode) => void;
  onDelete: (mode: RecordMode) => void;
  onClear: () => void;
  onMeta: () => void;
}) {
  const totalDays = daysInMonth(year, month);
  const today = new Date();
  const selectedRecords = (['빠른 대전', '경쟁전'] as RecordMode[]).map((mode) => ({
    mode,
    record: records[`${selectedDate}-${mode}`],
  }));

  function handleDelete(mode: RecordMode) {
    if (window.confirm(`${selectedDate} ${mode} 기록을 삭제할까요?`)) onDelete(mode);
  }

  function handleClear() {
    const count = Object.keys(records).length;
    if (count && window.confirm(`저장된 빠른 대전·경쟁전 기록 ${count}개를 모두 삭제할까요?`)) onClear();
  }

  return (
    <div id="top" className="max-w-[88vw] xl:max-w-[1240px] mx-auto py-12 px-4">
      <PageTitle
        eyebrow={`TIER ARCHIVE · ${MONTH_LABELS_EN[month - 1]}`}
        title="오늘의 플레이를"
        accent="기록하세요."
        description="빠른 대전과 경쟁전을 나눠 기록하고, 최고의 장면까지 한곳에 남겨보세요."
        action={
          <div className="flex gap-1.5 max-[760px]:w-full">
            <Button variant="primary" size="compact" className="max-[760px]:flex-1">
              나의 기록
            </Button>
            <Button variant="outline" size="compact" onClick={onMeta} className="max-[760px]:flex-1">
              메타 인사이트
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-[1.5fr_1fr] gap-5 max-[760px]:grid-cols-1">
        <div className="p-6.5 border border-white/10 bg-surface/88 backdrop-blur-lg">
          <div className="grid grid-cols-[38px_1fr_38px] items-center mb-5.5">
            <button
              type="button"
              aria-label="이전 달"
              onClick={onPrevMonth}
              className="w-8.5 h-8.5 rounded-full border border-white/12 hover:border-accent/60"
            >
              ‹
            </button>
            <div className="text-center">
              <strong className="block text-2xl font-black tracking-widest">
                {year}. {String(month).padStart(2, '0')}
              </strong>
              <button
                type="button"
                onClick={onToday}
                className="block mx-auto mt-1 text-muted text-[11px] hover:text-accent"
              >
                오늘로 이동
              </button>
            </div>
            <button
              type="button"
              aria-label="다음 달"
              onClick={onNextMonth}
              className="w-8.5 h-8.5 rounded-full border border-white/12 hover:border-accent/60"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 text-center">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <span key={day} className="pb-3 text-[#6f6f78] text-[9px] font-extrabold tracking-widest">
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center">
            {calendarDays.map((day, index) => {
              const valid = day > 0 && day <= totalDays;
              const date = valid ? dateKey(year, month, day) : '';
              const dayRecords = valid
                ? Object.values(records).filter((record) => record.date === date)
                : [];
              const isGold = dayRecords.some((record) => record.videoName);
              const isToday = valid && isSameDate(year, month, day, today);
              return (
                <button
                  key={`${day}-${index}`}
                  disabled={!valid}
                  onClick={() => valid && setSelectedDay(day)}
                  className={`relative min-h-[54px] text-[13px] ${
                    valid && selectedDay === day
                      ? 'font-black text-ink'
                      : isToday
                        ? 'text-accent font-bold hover:bg-accent/8'
                        : 'text-paper hover:bg-accent/8'
                  }`}
                >
                  {valid && selectedDay === day && (
                    <span className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 -rotate-3 bg-accent [clip-path:polygon(8%_0,100%_7%,92%_100%,0_88%)] -z-10" />
                  )}
                  {valid ? day : ''}
                  {dayRecords.length > 0 && (
                    <i
                      className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full ${
                        isGold ? 'w-1.5 h-1.5 bg-gold shadow-[0_0_12px_var(--color-gold)]' : 'w-1 h-1 bg-[#707079]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 mt-4 text-muted text-[11px]">
            <span className="flex items-center gap-1.5">
              <i className="w-1 h-1 rounded-full bg-[#707079] inline-block" /> 기록
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-1.5 h-1.5 rounded-full bg-gold inline-block" /> 최고의 플레이
            </span>
          </div>
        </div>

        <aside className="p-6.5 border border-accent/20 bg-surface flex flex-col items-center justify-center text-center">
          <span className="text-muted text-[10px] font-extrabold tracking-widest">CURRENT RANK</span>
          <div className="w-16 h-16 my-3 rounded-full border border-accent/60 grid place-items-center text-2xl font-black">
            P
          </div>
          <h3 className="text-xl font-black">{profile.tier}</h3>
          <p className="text-muted text-xs mt-1">
            지난 기록 대비 <b className="text-accent">+3.8%</b>
          </p>
          <small className="text-muted text-[10px] mt-3">다음 승급까지 42%</small>
        </aside>
      </div>

      <section className="flex items-center justify-between mt-9 mb-4 max-[760px]:items-start max-[760px]:flex-col max-[760px]:gap-2">
        <div>
          <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">
            SELECTED · {String(month).padStart(2, '0')}.{String(selectedDay).padStart(2, '0')}
          </p>
          <h2 className="text-2xl font-black">오늘의 기록</h2>
        </div>
        <div className="flex items-center gap-3 text-muted text-xs">
          <span>모드별 1개씩 저장할 수 있어요.</span>
          {Object.keys(records).length > 0 && (
            <button onClick={handleClear} className="text-red-400 underline">
              전체 기록 삭제
            </button>
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
        {selectedRecords.map(({ mode, record }) => (
          <article key={mode} className="border border-white/10 bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted text-[10px] font-extrabold tracking-widest">
                {mode === '경쟁전' ? 'COMPETITIVE' : 'QUICK PLAY'}
              </span>
              <b>{mode}</b>
              {record && <i className="not-italic text-accent text-xs">{mode === '빠른 대전' ? '언랭' : record.tier}</i>}
            </div>

            {record ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <HeroImage heroes={heroes} name={record.hero} className="w-12 h-12" />
                  <div>
                    <strong className="block">{record.hero}</strong>
                    <span className="text-muted text-xs">{record.position}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {([['K', record.kills], ['A', record.assists], ['D', record.deaths]] as const).map(
                    ([label, value]) => (
                      <div key={label} className="text-center p-2 border border-white/10">
                        <small className="block text-muted text-[9px]">{label}</small>
                        <b className="text-lg">{value}</b>
                      </div>
                    ),
                  )}
                </div>
                <p className="text-muted text-xs mb-4">{record.memo || '메모가 없습니다.'}</p>
                <div className="flex items-center justify-between">
                  <span className={record.videoName ? 'text-gold text-xs' : 'text-muted text-xs'}>
                    {record.videoName ? `◆ ${record.videoName}` : '최고의 플레이 없음'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(mode)} className="text-red-400 text-xs">
                      삭제
                    </button>
                    <button onClick={() => openRecord(mode)} className="text-accent text-xs font-bold">
                      수정하기 →
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <span className="text-accent text-3xl">＋</span>
                <h3 className="font-bold mt-2">{mode} 기록이 없어요</h3>
                <p className="text-muted text-xs mt-1 mb-4">K/A/D와 오늘의 최고의 플레이를 남겨보세요.</p>
                <Button size="compact" onClick={() => openRecord(mode)} icon="↗">
                  기록하기
                </Button>
              </div>
            )}
          </article>
        ))}
      </div>

      <section className="mt-10 p-6 border border-white/10 grid grid-cols-[1fr_repeat(3,auto)_2fr] gap-4 items-center max-[760px]:grid-cols-3">
        <div className="max-[760px]:col-span-3">
          <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">7 DAYS SUMMARY</p>
          <h3 className="font-black">이번 주 전투 리포트</h3>
        </div>
        <div className="text-center">
          <b className="block text-xl">2.84</b>
          <span className="text-muted text-[10px]">평균 K/D</span>
        </div>
        <div className="text-center">
          <b className="block text-xl">61%</b>
          <span className="text-muted text-[10px]">승률</span>
        </div>
        <div className="text-center">
          <b className="block text-xl">12</b>
          <span className="text-muted text-[10px]">플레이</span>
        </div>
        <div className="flex items-end gap-1.5 h-16 max-[760px]:col-span-3">
          {[28, 55, 35, 74, 48, 88, 67].map((height, index) => (
            <i key={index} style={{ height: `${height}%` }} className="flex-1 bg-accent/70" />
          ))}
        </div>
      </section>
    </div>
  );
}