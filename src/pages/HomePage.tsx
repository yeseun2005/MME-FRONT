import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Header } from '../components/layout/Header';
import { SideNav } from '../components/layout/SideNav';
import { BottomNav } from '../components/layout/BottomNav';
import { SaveToast } from '../components/SaveToast';
import { ChatPanel } from '../components/ChatPanel';
import { LoginScreen } from '../features/auth/LoginScreen';
import { RecordView } from '../features/record/RecordView';
import { MetaView } from '../features/record/MetaView';
import { RecordModal } from '../features/record/modals/RecordModal';
import { FeedbackView } from '../features/feedback/FeedbackView';
import { CoachModal } from '../features/feedback/modals/CoachModal';
import { ProviderVerifyModal } from '../features/feedback/modals/ProviderVerifyModal';
import { GroupView } from '../features/group/GroupView';
import { PartyModal } from '../features/group/modals/PartyModal';
import { CommunityView } from '../features/community/CommunityView';
import { PostModal } from '../features/community/modals/PostModal';
import { ProfileView } from '../features/profile/ProfileView';
import { useAuthGate } from '../hooks/useAuthGate';
import { useHeroesAndMeta } from '../hooks/useHeroesAndMeta';
import { useGameRecords } from '../hooks/useGameRecords';
import { useSaveNotice } from '../hooks/useSaveNotice';
import { coaches, initialParties, initialPosts } from '../constants/mock';
import type { Coach, Party, Post, RecordDraft, RecordMode, View } from '../types';

export function HomePage() {
  const { authenticated, authReady, onboarding, profile, setProfile, completeLogin, startApp, logout } =
    useAuthGate();
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

  const [communityCategory, setCommunityCategory] =
    useState<'전체' | '빠대용' | '경쟁용' | '스타디움용' | '사설방용' | 'OWCS용' | 'MVP'>('전체');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [postOpen, setPostOpen] = useState(false);

  const [chatTitle, setChatTitle] = useState('');
  const [chatMessages, setChatMessages] = useState([
    '안녕하세요! 오늘도 즐겜해요 🙌',
    '네, 저는 지원으로 갈게요.',
  ]);
  const [chatInput, setChatInput] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  const selectedDate = `2026-08-${String(selectedDay).padStart(2, '0')}`;
  const calendarDays = useMemo(() => Array.from({ length: 42 }, (_, index) => index - 5), []);
  const roleCounts = useMemo(
    () => ({
      tank: heroes.filter((hero) => hero.role === 'tank').length,
      damage: heroes.filter((hero) => hero.role === 'damage').length,
      support: heroes.filter((hero) => hero.role === 'support').length,
    }),
    [heroes],
  );

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
      videoUrl: recordDraft.videoUrl,
    });
    notify(`${selectedMode} 기록이 저장되었습니다.`, '기기에 안전하게 저장했습니다.');
    setRecordOpen(false);
  }

  function saveProfile() {
    notify('프로필이 저장되었습니다.', '게임 프로필과 선호 설정을 반영했습니다.');
  }

  function beginMatching() {
    setMatching(true);
    setMatchDone(false);
    window.setTimeout(() => {
      setMatching(false);
      setMatchDone(true);
    }, 1100);
  }

  function sendMessage() {
    if (!chatInput.trim()) return;
    setChatMessages((current) => [...current, chatInput.trim()]);
    setChatInput('');
  }

  function likePost(post: Post) {
    setPosts((current) => current.map((item) => (item.id === post.id ? { ...item, likes: item.likes + 1 } : item)));
  }

  if (!authReady) {
    return (
      <main className="min-h-dvh grid place-content-center gap-5 justify-items-center bg-ink text-accent text-[10px] font-black tracking-[0.26em]">
        <div className="w-20 h-20 grid place-items-center bg-accent text-ink text-2xl font-black">MM</div>
        LOADING ARCHIVE
      </main>
    );
  }

  if (!authenticated) {
    return (
      <LoginScreen
        onboarding={onboarding}
        profile={profile}
        setProfile={setProfile}
        heroes={heroes}
        onLogin={completeLogin}
        onStart={startApp}
      />
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
            <CommunityView
              posts={posts}
              category={communityCategory}
              setCategory={setCommunityCategory}
              onCreate={() => setPostOpen(true)}
              onLike={likePost}
              heroes={heroes}
            />
          )}

          {view === 'profile' && (
            <ProfileView
              profile={profile}
              setProfile={setProfile}
              heroes={heroes}
              roleCounts={roleCounts}
              onSave={saveProfile}
              onLogout={logout}
            />
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

      {postOpen && (
        <PostModal
          onClose={() => setPostOpen(false)}
          onCreate={(post) => {
            setPosts((current) => [post, ...current]);
            setPostOpen(false);
          }}
        />
      )}

      {chatTitle && (
        <ChatPanel
          title={chatTitle}
          messages={chatMessages}
          input={chatInput}
          setInput={setChatInput}
          send={sendMessage}
          close={() => setChatTitle('')}
        />
      )}
    </main>
  );
}