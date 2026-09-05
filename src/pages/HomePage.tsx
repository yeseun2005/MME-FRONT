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
import { AdminView } from '../features/admin/AdminView';
import { useAuthGate } from '../hooks/useAuthGate';
import { useHeroesAndMeta } from '../hooks/useHeroesAndMeta';
import { useGameRecords } from '../hooks/useGameRecords';
import { useSaveNotice } from '../hooks/useSaveNotice';
import { useTheme } from '../hooks/useTheme';
import { useNotifications } from '../hooks/useNotifications';
import { coaches, initialParties, initialPosts } from '../constants/mock';
import { buildCalendarCells, clampDay, dateKey, shiftMonth } from '../lib/date';
import { JobPostModal } from '../features/feedback/modals/JobPostModal';
import type { Coach, Party, Post, RecordDraft, RecordMode, View } from '../types';

export function HomePage() {
  const { authenticated, authReady, onboarding, profile, setProfile, completeLogin, startApp, logout } =
    useAuthGate();
  const { heroes, metaData } = useHeroesAndMeta();
  const { records, saveRecord, deleteRecord, clearRecords } = useGameRecords();
  const { saveNotice, notify, dismiss } = useSaveNotice();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, push: pushNotification, markAllRead } = useNotifications(
    profile.notificationsEnabled,
  );

  const [view, setView] = useState<View>('record');
  const [recordSection, setRecordSection] = useState<'diary' | 'meta'>('diary');
  const [notifOpen, setNotifOpen] = useState(false);

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
    videoUrl: '',
    videoFile: null,
  });

  const [coachFilter, setCoachFilter] = useState<'전체' | '돌격' | '공격' | '지원'>('전체');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [feedbackRequested, setFeedbackRequested] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [jobPostOpen, setJobPostOpen] = useState(false);

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
    pushNotification('기록', `${selectedMode} 기록이 저장됐어요`, `${selectedDate} · ${recordDraft.hero}`, 'record');
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
      pushNotification('매칭', '팀이 완성됐어요!', `${partySize}인 랜덤팟 매칭이 완료됐어요.`, 'group');
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

  function addComment(post: Post, body: string) {
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id
          ? { ...item, comments: [...item.comments, { id: Date.now(), author: 'MekaPilot', body, time: '방금 전' }] }
          : item,
      ),
    );
  }

  function editComment(post: Post, commentId: number, body: string) {
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id
          ? { ...item, comments: item.comments.map((comment) => (comment.id === commentId ? { ...comment, body } : comment)) }
          : item,
      ),
    );
  }

  function deleteComment(post: Post, commentId: number) {
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id ? { ...item, comments: item.comments.filter((comment) => comment.id !== commentId) } : item,
      ),
    );
  }

  function handleSelectNotif(target: View) {
    setView(target);
    setNotifOpen(false);
  }

  if (!authReady) {
    return (
      <main className="min-h-dvh grid place-content-center gap-5 justify-items-center bg-bg text-accent text-[10px] font-black tracking-[0.26em]">
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
    <main className="bg-bg text-paper pb-16 lg:pb-20">
      <Header
        profile={profile}
        onProfile={() => setView('profile')}
        theme={theme}
        onToggleTheme={toggleTheme}
        notifications={notifications}
        unreadCount={unreadCount}
        notifOpen={notifOpen}
        onToggleNotif={() => setNotifOpen((current) => !current)}
        onSelectNotif={handleSelectNotif}
        onMarkAllRead={markAllRead}
      />

      <div className="flex w-full max-w-[1600px] mx-auto gap-8 px-8 pt-6">
        <SideNav view={view} setView={setView} />

        <section className="flex-1 min-w-0">
          {view === 'record' && recordSection === 'diary' && (
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
              onWriteJobPost={() => setJobPostOpen(true)}
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
              onCommentAdd={addComment}
              onCommentEdit={editComment}
              onCommentDelete={deleteComment}
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

          {view === 'admin' && (
            <AdminView
              onResolved={(result) => {
                if (!result.isMine) return;
                setProfile((current) => ({
                  ...current,
                  providerStatus: result.status === '승인' ? 'approved' : 'rejected',
                  providerType: result.status === '승인' ? result.credential : current.providerType,
                  providerRejectReason: result.status === '반려' ? result.reason : undefined,
                }));
                pushNotification(
                  '검수결과',
                  result.status === '승인' ? '제공자 인증이 승인됐어요' : '제공자 인증이 반려됐어요',
                  result.status === '승인'
                    ? `${result.credential} 자격으로 구인글을 작성할 수 있어요.`
                    : result.reason || '사유를 확인하고 다시 신청해 주세요.',
                  'profile',
                );
              }}
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
          onRequest={() => {
            setFeedbackRequested(true);
            pushNotification(
              '피드백',
              '피드백 요청이 접수됐어요',
              `${selectedCoach.nickname} 코치에게 요청을 보냈어요.`,
              'feedback',
            );
          }}
          onChat={() => {
            setChatTitle(selectedCoach.nickname);
            setSelectedCoach(null);
          }}
        />
      )}

      {verificationOpen && (
        <ProviderVerifyModal profile={profile} setProfile={setProfile} onClose={() => setVerificationOpen(false)} />
      )}

      {jobPostOpen && (
        <JobPostModal
          onClose={() => setJobPostOpen(false)}
          onSave={() => {
            notify('구인글이 게시되었습니다.', '피드백 제공자 목록에 반영되었습니다.');
            setJobPostOpen(false);
          }}
        />
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