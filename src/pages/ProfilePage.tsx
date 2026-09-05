import { useMemo } from 'react';
import { ProfileView } from '../features/profile/ProfileView';
import { useApp } from '../app/outlet-context';

export function ProfilePage() {
  const { profile, setProfile, heroes, logout, notify } = useApp();

  const roleCounts = useMemo(
    () => ({
      tank: heroes.filter((hero) => hero.role === 'tank').length,
      damage: heroes.filter((hero) => hero.role === 'damage').length,
      support: heroes.filter((hero) => hero.role === 'support').length,
    }),
    [heroes],
  );

  return (
    <ProfileView
      profile={profile}
      setProfile={setProfile}
      heroes={heroes}
      roleCounts={roleCounts}
      onSave={() => notify('프로필이 저장되었습니다.', '게임 프로필과 선호 설정을 반영했습니다.')}
      onLogout={logout}
    />
  );
}