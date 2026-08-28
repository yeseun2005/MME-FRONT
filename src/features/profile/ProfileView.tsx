import type { Dispatch, SetStateAction } from 'react';
import { PageTitle } from '../../components/layout/PageTitle';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { TierSelect } from '../../components/ui/TierSelect';
import { heroImage } from '../../lib/format';
import type { Hero, Profile } from '../../types';
import { HeroSelect } from '../../components/ui/HeroSelect';

export function ProfileView({
  profile,
  setProfile,
  heroes,
  roleCounts,
  onSave,
  onLogout,
}: {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  heroes: Hero[];
  roleCounts: { tank: number; damage: number; support: number };
  onSave: () => void;
  onLogout: () => void;
}) {
  const providerCopy =
    profile.providerStatus === 'approved'
      ? `${profile.providerType} 인증 완료`
      : profile.providerStatus === 'review'
        ? '운영자 검수 중'
        : '미신청';

  return (
    <div className="max-w-[1040px] mx-auto py-12 px-4">
      <PageTitle
        eyebrow="PLAYER PROFILE"
        title="나만의"
        accent="플레이 스타일."
        description="게임 프로필과 계정 연결, 앱의 화면 설정을 한곳에서 관리하세요."
      />

      <div className="grid grid-cols-[1fr_1.4fr] gap-6 max-[900px]:grid-cols-1">
        <Card className="flex flex-col">
          <div className="relative h-40">
            {heroImage(heroes, profile.heroes[0]) && (
              <img src={heroImage(heroes, profile.heroes[0])} alt="" className="w-full h-full object-cover" />
            )}
            <div className="absolute left-5 -bottom-6 w-14 h-14 rounded-full grid place-items-center bg-accent text-ink font-black">
              MP
            </div>
            <span className="absolute right-4 top-4 text-white text-[9px] font-extrabold tracking-widest bg-black/50 px-2 py-1">
              PLAYER SINCE 2026
            </span>
          </div>
          <div className="p-5 pt-9">
            <h2 className="text-xl font-black">
              {profile.nickname} {profile.nexon && <i className="not-italic text-accent">✓</i>}
            </h2>
            <p className="text-muted text-sm mt-1">"한 판 더"를 기록으로 바꾸는 플레이어.</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="px-2.5 py-1 border border-white/10 text-xs">{profile.tier}</span>
              <span className="px-2.5 py-1 border border-white/10 text-xs">{profile.position}</span>
              {profile.providerStatus === 'approved' && (
                <span className="px-2.5 py-1 border border-accent/40 text-accent text-xs">{profile.providerType}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 border-t border-white/10">
            {[
              ['14', '기록'],
              ['3', '피드백'],
              ['8', '그룹'],
            ].map(([value, label]) => (
              <div key={label} className="text-center py-4 border-r border-white/10 last:border-r-0">
                <b className="block text-xl">{value}</b>
                <span className="text-muted text-xs">{label}</span>
              </div>
            ))}
          </div>
        </Card>

        <section className="p-6 border border-white/10 bg-surface">
          <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">GAME PROFILE</p>
          <h2 className="font-black text-xl mt-1 mb-5">기본 정보</h2>

          <label className="grid gap-2 text-muted text-[11px] font-extrabold mb-4">
            닉네임
            <input
              value={profile.nickname}
              onChange={(event) => setProfile((current) => ({ ...current, nickname: event.target.value }))}
              className="h-11 px-3 border border-white/10 bg-surface-2 text-paper outline-none focus:border-accent/60"
            />
          </label>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="grid gap-2 text-muted text-[11px] font-extrabold">
                티어
                <TierSelect
                    value={profile.tier}
                    onChange={(tier) => setProfile((current) => ({ ...current, tier }))}
                />
            </label>
            <label className="grid gap-2 text-muted text-[11px] font-extrabold">
              포지션
              <Select
                value={profile.position}
                onChange={(event) => setProfile((current) => ({ ...current, position: event.target.value }))}
              >
                {['돌격', '공격', '지원'].map((position) => (
                  <option key={position}>{position}</option>
                ))}
              </Select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4"> 
            <label className="grid gap-2 text-muted text-[11px] font-extrabold">
                주 영웅 1
                <HeroSelect
                    heroes={heroes}
                    value={profile.heroes[0]}
                    onChange={(name) => setProfile((current) => ({ ...current, heroes: [name, current.heroes[1]] }))}
                />
                </label>
                <label className="grid gap-2 text-muted text-[11px] font-extrabold">
                주 영웅 2
                <HeroSelect
                    heroes={heroes}
                    value={profile.heroes[1]}
                    onChange={(name) => setProfile((current) => ({ ...current, heroes: [current.heroes[0], name] }))}
                />
            </label>
          </div>

          <div className="flex items-center gap-4 mb-6">
            {profile.heroes.map((name) => (
              <div key={name} className="flex items-center gap-2">
                {heroImage(heroes, name) && (
                  <img src={heroImage(heroes, name)} alt="" className="w-9 h-9 object-cover" />
                )}
                <span className="text-sm">{name}</span>
              </div>
            ))}
            <small className="text-muted text-xs ml-auto">
              영웅 데이터 {heroes.length}명 · 돌격 {roleCounts.tank} · 공격 {roleCounts.damage} · 지원 {roleCounts.support}
            </small>
          </div>

          <Button variant="primary" size="wide" icon="✓" onClick={onSave}>
            프로필 저장
          </Button>
        </section>
      </div>

      <section className="mt-6 p-6 border border-white/10 bg-surface">
        <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">ACCOUNT & DISPLAY</p>
        <h2 className="font-black text-xl mt-1 mb-5">연동 및 설정</h2>

        <div className="grid gap-0 divide-y divide-white/10">
          <div className="flex items-center justify-between py-4">
            <span>
              <b className="block">넥슨 계정</b>
              <small className="text-muted text-xs">
                {profile.nexon ? '연동됨 · 닉네임 인증 배지 활성' : '연동되지 않음'}
              </small>
            </span>
            <i className={`not-italic text-xs font-extrabold ${profile.nexon ? 'text-accent' : 'text-muted'}`}>
              {profile.nexon ? 'ON' : 'OFF'}
            </i>
          </div>

          <div className="flex items-center justify-between py-4">
            <span>
              <b className="block">피드백 제공자</b>
              <small className="text-muted text-xs">넥슨 인증과 별도로 운영자가 자격을 검수합니다.</small>
            </span>
            <i
              className={`not-italic text-xs font-extrabold ${
                profile.providerStatus === 'approved' ? 'text-accent' : 'text-muted'
              }`}
            >
              {providerCopy}
            </i>
          </div>

          <div className="flex items-center justify-between py-4">
            <span>
              <b className="block">플레이 알림</b>
              <small className="text-muted text-xs">매칭과 피드백 소식을 받아요.</small>
            </span>
            <button
              onClick={() =>
                setProfile((current) => ({ ...current, notificationsEnabled: !current.notificationsEnabled }))
              }
              className={`not-italic text-xs font-extrabold ${
                profile.notificationsEnabled ? 'text-accent' : 'text-muted'
              }`}
            >
              {profile.notificationsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <Button
            variant="danger"
            className="mt-4 h-10 px-6 justify-center text-xs"
            onClick={onLogout}
            >
            계정 연동 해지 및 로그아웃
        </Button>
      </section>
    </div>
  );
}