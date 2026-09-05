import { useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { SideNav } from '../components/layout/SideNav';
import { BottomNav } from '../components/layout/BottomNav';
import { SaveToast } from '../components/SaveToast';
import { ChatPanel } from '../components/ChatPanel';
import { LoginScreen } from '../features/auth/LoginScreen';
import { useAuthGate } from '../hooks/useAuthGate';
import { useHeroesAndMeta } from '../hooks/useHeroesAndMeta';
import { useGameRecords } from '../hooks/useGameRecords';
import { useSaveNotice } from '../hooks/useSaveNotice';
import { useTheme } from '../hooks/useTheme';
import { useNotifications } from '../hooks/useNotifications';
import { initialParties, initialPosts } from '../constants/mock';
import { viewPaths } from '../constants/nav';
import type { AppOutletContext } from '../app/outlet-context';
import type { Party, Post, View } from '../types';

export function AppLayout() {
  const navigate = useNavigate();
  const { authenticated, authReady, onboarding, profile, setProfile, completeLogin, startApp, logout } =
    useAuthGate();
  const { heroes, metaData } = useHeroesAndMeta();
  const { records, saveRecord, deleteRecord, clearRecords } = useGameRecords();
  const { saveNotice, notify, dismiss } = useSaveNotice();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, push: pushNotification, markAllRead } = useNotifications(
    profile.notificationsEnabled,
  );

  const [notifOpen, setNotifOpen] = useState(false);
  const [parties, setParties] = useState<Party[]>(initialParties);
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const [chatTitle, setChatTitle] = useState('');
  const [chatMessages, setChatMessages] = useState([
    '안녕하세요! 오늘도 즐겜해요 🙌',
    '네, 저는 지원으로 갈게요.',
  ]);
  const [chatInput, setChatInput] = useState('');

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
          ? {
              ...item,
              comments: item.comments.map((comment) =>
                comment.id === commentId ? { ...comment, body } : comment,
              ),
            }
          : item,
      ),
    );
  }

  function deleteComment(post: Post, commentId: number) {
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id
          ? { ...item, comments: item.comments.filter((comment) => comment.id !== commentId) }
          : item,
      ),
    );
  }

  function handleSelectNotif(target: View) {
    navigate(viewPaths[target]);
    setNotifOpen(false);
  }

  const context: AppOutletContext = useMemo(
    () => ({
      profile,
      setProfile,
      logout,
      heroes,
      metaData,
      records,
      saveRecord,
      deleteRecord,
      clearRecords,
      parties,
      setParties,
      posts,
      setPosts,
      likePost,
      addComment,
      editComment,
      deleteComment,
      notify,
      pushNotification,
      openChat: setChatTitle,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, heroes, metaData, records, parties, posts],
  );

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
        onProfile={() => navigate('/profile')}
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
        <SideNav />

        <section className="flex-1 min-w-0">
          <Outlet context={context} />
        </section>
      </div>

      <BottomNav />

      {saveNotice && <SaveToast notice={saveNotice} onClose={dismiss} />}

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