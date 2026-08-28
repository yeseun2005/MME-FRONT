import type { Dispatch, SetStateAction } from 'react';
import { tierOptions } from '../../constants/tiers';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { Hero, Profile } from '../../types';

const socialProviders = [
  { key: '카카오', label: '카카오로 시작하기', glyph: 'K' },
  { key: '구글', label: 'Google로 시작하기', glyph: 'G' },
  { key: '넥슨', label: '넥슨 계정 연동하기', glyph: 'N' },
] as const;

export function LoginScreen({
  onboarding,
  profile,
  setProfile,
  heroes,
  onLogin,
  onStart,
}: {
  onboarding: boolean;
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  heroes: Hero[];
  onLogin: (provider: string) => void;
  onStart: () => void;
}) {
  return (
    <main className="relative min-h-dvh grid grid-cols-[1.2fr_0.8fr] overflow-x-hidden bg-[#0b0b0d] text-paper max-[760px]:grid-cols-1">
      <section className="relative z-10 min-h-dvh flex flex-col justify-center p-[clamp(48px,8vw,110px)] border-r border-accent/18 max-[760px]:min-h-[42dvh] max-[760px]:border-r-0 max-[760px]:border-b">
        <p className="text-accent text-[11px] font-extrabold tracking-[0.2em] mb-6">OVERWATCH LIFE ARCHIVE</p>
        <div className="text-[clamp(72px,12vw,160px)] font-black italic leading-none mb-4">
          MM<span className="text-accent">e</span>
        </div>
        <h1 className="text-[clamp(32px,5vw,52px)] font-black italic uppercase leading-[0.95] mb-5">
          MAKE YOUR
          <br />
          <em className="text-accent not-italic">MAD MOVIE.</em>
        </h1>
        <p className="text-muted leading-relaxed mb-6 max-w-[420px]">
          기록하고, 배우고, 함께 플레이하세요.
          <br />
          당신의 최고의 플레이가 시작되는 곳.
        </p>
        <small className="text-muted text-xs">MadMaker · 즐거운 오버워치 라이프 되시길!</small>
      </section>

      <section className="relative z-10 min-h-dvh flex flex-col justify-center p-[clamp(34px,6vw,80px)] gap-6 max-[760px]:min-h-[58dvh]">
        {!onboarding ? (
          <>
            <div>
              <p className="text-accent text-[11px] font-extrabold tracking-[0.2em] mb-3">WELCOME, PLAYER</p>
              <h2 className="text-[clamp(26px,4vw,36px)] font-black leading-tight">
                게임을 시작하려면
                <br />
                계정을 연결하세요.
              </h2>
            </div>

            <div className="grid gap-3">
              {socialProviders.map((provider) => (
                <button
                  key={provider.key}
                  onClick={() => onLogin(provider.key)}
                  className="flex items-center gap-4 h-14 px-5 border border-white/10 bg-surface text-left hover:border-accent/40"
                >
                  <span className="w-8 h-8 grid place-items-center rounded-full bg-white/10 font-black">
                    {provider.glyph}
                  </span>
                  <b className="flex-1">{provider.label}</b>
                  <i className="not-italic text-muted">→</i>
                </button>
              ))}
            </div>

            <p className="text-muted text-xs">계속하면 이용약관과 개인정보 처리방침에 동의하게 됩니다.</p>
          </>
        ) : (
          <>
            <div>
              <p className="text-accent text-[11px] font-extrabold tracking-[0.2em] mb-3">PLAYER SETUP · 01</p>
              <h2 className="text-[clamp(26px,4vw,36px)] font-black leading-tight">
                플레이어 프로필을
                <br />
                완성하세요.
              </h2>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-muted text-[11px] font-extrabold">
                닉네임
                <Input
                  value={profile.nickname}
                  onChange={(event) => setProfile((current) => ({ ...current, nickname: event.target.value }))}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2 text-muted text-[11px] font-extrabold">
                  현재 티어
                  <Select
                    value={profile.tier}
                    onChange={(event) => setProfile((current) => ({ ...current, tier: event.target.value }))}
                  >
                    {tierOptions.map((tier) => (
                      <option key={tier}>{tier}</option>
                    ))}
                  </Select>
                </label>
                <label className="grid gap-2 text-muted text-[11px] font-extrabold">
                  선호 포지션
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

              <label className="grid gap-2 text-muted text-[11px] font-extrabold">
                주 영웅
                <Select
                  value={profile.heroes[0]}
                  onChange={(event) =>
                    setProfile((current) => ({ ...current, heroes: [event.target.value, current.heroes[1]] }))
                  }
                >
                  {heroes.map((hero) => (
                    <option key={hero.id}>{hero.name}</option>
                  ))}
                </Select>
              </label>

              <Button variant="primary" size="wide" icon="→" onClick={onStart}>
                MMe 시작하기
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}