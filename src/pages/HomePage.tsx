import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Header } from '../components/layout/Header';
import { SideNav } from '../components/layout/SideNav';
import { BottomNav } from '../components/layout/BottomNav';
import { SaveToast } from '../components/SaveToast';
import { RecordView } from '../features/record/RecordView';
import { MetaView } from '../features/record/MetaView';
import { RecordModal } from '../features/record/modals/RecordModal';
import { FeedbackView } from '../features/feedback/FeedbackView';
import { CoachModal } from '../features/feedback/modals/CoachModal';
import { ProviderVerifyModal } from '../features/feedback/modals/ProviderVerifyModal';
import { GroupView } from '../features/group/GroupView';
import { PartyModal } from '../features/group/modals/PartyModal';
import { useAuthGate } from '../hooks/useAuthGate';
import { useHeroesAndMeta } from '../hooks/useHeroesAndMeta';
import { useGameRecords } from '../hooks/useGameRecords';
import { useSaveNotice } from '../hooks/useSaveNotice';
import { coaches, initialParties } from '../constants/mock';
import type { Coach, Party, RecordDraft, RecordMode, View } from '../types';

export function HomePage() {
  // ⚠️ 임시: LoginScreen이 아직 없어서 authenticated 게이트는 건너뜁니다.
  const { authReady, profile, setProfile } = useAuthGate();
  const { heroes, metaData } = useHeroesAndMeta();
  const { records, saveRecord, deleteRecord, clearRecords } = useGameRecords();
  const { saveNotice, notify, dismiss } = useSaveNotice();

  const [view, setView] = useState<View>('record');
  const [recordSection, setRecordSection] = useState<'diary' | 'meta'>('diary');

  const [selectedDay, setSelectedDay] = useState(26);
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
    videoUrl: '',
    videoFile: null,
  });

  const [coachFilter, setCoachFilter] = useState<'전체' | '돌격' | '공격' | '지원'>('전체');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [feedbackRequested, setFeedbackRequested] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);

  const [groupMode, setGroupMode] = useState<'home' | 'random' | 'select'>('home');
  const [partySize, setPartySize] = useState(4);
  const [matching, setMatching] = useState(false);
  const [matchDone, setMatchDone] = useState(false);
  const [parties, setParties] = useState<Party[]>(initialParties);
  const [partyOpen, setPartyOpen] = useState(false);

  const [chatTitle, setChatTitle] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  const selectedDate = `2026-08-${String(selectedDay).padStart(2, '0')}`;
  const calendarDays = useMemo(() => Array.from({ length: 42 }, (_, index) => index - 5), []);

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
            videoUrl: existing.videoUrl || '',
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
            videoUrl: '',
            videoFile: null,
          },
    );
    setRecordOpen(true);
  }

  async function handleSaveRecord(event: FormEvent) {
    event.preventDefault();
    await saveRecord(selectedDate, selectedMode, {
      kills: recordDraft.kills,
      assists: recordDraft.assists,
      deaths: recordDraft.deaths,
      tier: selectedMode === '빠른 대전' ? '언랭' : recordDraft.tier,
      position: recordDraft.position,
      hero: recordDraft.hero,
      memo: recordDraft.memo,
      videoName: recordDraft.videoName,
      videoUrl: recordDraft.videoUrl,
    });
    notify(`${selectedMode} 기록이 저장되었습니다.`, '기기에 안전하게 저장했습니다.');
    setRecordOpen(false);
  }

  function beginMatching() {
    setMatching(true);
    setMatchDone(false);
    window.setTimeout(() => {
      setMatching(false);
      setMatchDone(true);
    }, 1100);
  }

  if (!authReady) {
    return (
      <main className="min-h-dvh grid place-content-center gap-5 justify-items-center bg-ink text-accent text-[10px] font-black tracking-[0.26em]">
        <div className="w-20 h-20 grid place-items-center bg-accent text-ink text-2xl font-black">MM</div>
        LOADING ARCHIVE
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-ink text-paper pb-28">
      <Header
        profile={profile}
        notificationOpen={notificationOpen}
        setNotificationOpen={setNotificationOpen}
        onProfile={() => setView('profile')}
        />

      <div className="flex max-w-[1180px] mx-auto gap-8 px-4">
        <SideNav view={view} setView={setView} />

        <section className="flex-1 min-w-0">
          {view === 'record' && recordSection === 'diary' && (
            <RecordView
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
              onMeta={() => setRecordSection('meta')}
            />
          )}
          {view === 'record' && recordSection === 'meta' && (
            <MetaView data={metaData} onDiary={() => setRecordSection('diary')} />
          )}

          {view === 'feedback' && (
            <FeedbackView
              coaches={coaches}
              filter={coachFilter}
              setFilter={setCoachFilter}
              onCoach={setSelectedCoach}
              onChat={setChatTitle}
              onVerify={() => setVerificationOpen(true)}
              profile={profile}
            />
          )}

          {view === 'group' && (
            <GroupView
              mode={groupMode}
              setMode={setGroupMode}
              partySize={partySize}
              setPartySize={setPartySize}
              matching={matching}
              matchDone={matchDone}
              beginMatching={beginMatching}
              parties={parties}
              onCreate={() => setPartyOpen(true)}
              onChat={setChatTitle}
            />
          )}

          {view === 'community' && (
            <div className="py-20 text-center text-muted">커뮤니티 화면은 다음 단계에서 만들 예정이에요.</div>
          )}
          {view === 'profile' && (
            <div className="py-20 text-center text-muted">프로필 화면은 다음 단계에서 만들 예정이에요.</div>
          )}
        </section>
      </div>

      <BottomNav view={view} setView={setView} />

      {saveNotice && <SaveToast notice={saveNotice} onClose={dismiss} />}

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

      {selectedCoach && (
        <CoachModal
          coach={selectedCoach}
          requested={feedbackRequested}
          onClose={() => {
            setSelectedCoach(null);
            setFeedbackRequested(false);
          }}
          onRequest={() => setFeedbackRequested(true)}
          onChat={() => {
            setChatTitle(selectedCoach.nickname);
            setSelectedCoach(null);
          }}
        />
      )}

      {verificationOpen && (
        <ProviderVerifyModal profile={profile} setProfile={setProfile} onClose={() => setVerificationOpen(false)} />
      )}

      {partyOpen && (
        <PartyModal
          onClose={() => setPartyOpen(false)}
          onCreate={(party) => {
            setParties((current) => [party, ...current]);
            setPartyOpen(false);
          }}
        />
      )}

      {/* ⚠️ 임시: 진짜 ChatPanel은 community 단계에서 만들 예정 */}
      {chatTitle && (
        <aside className="fixed right-4 bottom-24 z-40 w-72 p-4 border border-accent/40 bg-surface">
          <div className="flex items-center justify-between mb-2">
            <b>{chatTitle}</b>
            <button onClick={() => setChatTitle('')} className="text-muted">
              ×
            </button>
          </div>
          <p className="text-muted text-xs">채팅 패널은 다음 단계에서 제대로 만들 예정이에요.</p>
        </aside>
      )}
    </main>
  );
}