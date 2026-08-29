import { useState } from 'react';
import { PageTitle } from '../../components/layout/PageTitle';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Tag } from '../../components/ui/Tag';
import type { Party } from '../../types';

const partyFilters = ['전체', '경쟁전', '빠른 대전', '스타디움'] as const;

export function GroupView({
  mode,
  setMode,
  partySize,
  setPartySize,
  matching,
  matchDone,
  beginMatching,
  parties,
  onCreate,
  onChat,
}: {
  mode: 'home' | 'random' | 'select';
  setMode: (mode: 'home' | 'random' | 'select') => void;
  partySize: number;
  setPartySize: (size: number) => void;
  matching: boolean;
  matchDone: boolean;
  beginMatching: () => void;
  parties: Party[];
  onCreate: () => void;
  onChat: (title: string) => void;
}) {
  const [partyFilter, setPartyFilter] = useState<(typeof partyFilters)[number]>('전체');
  const filteredParties = partyFilter === '전체' ? parties : parties.filter((party) => party.mode === partyFilter);

  return (
    <div className="max-w-[88vw] xl:max-w-[1240px] mx-auto py-12 px-4">
      <PageTitle
        eyebrow="FIND YOUR SQUAD"
        title="혼자보다"
        accent="함께."
        description="바로 매칭되는 랜덤팟과 조건을 고르는 선택팟. 오늘 같이 플레이할 팀을 찾아보세요."
        action={
          mode !== 'home' && (
            <Button variant="outline" size="compact" onClick={() => setMode('home')}>
              ← 방식 다시 선택
            </Button>
          )
        }
      />

      {mode === 'home' && (
        <div className="grid grid-cols-2 gap-5 max-[600px]:grid-cols-1">
          <button
            onClick={() => setMode('random')}
            className="p-8 border border-white/10 bg-surface text-left hover:border-accent/40"
          >
            <span className="block text-muted text-xs mb-4">01</span>
            <div className="w-16 h-16 mb-6 grid place-items-center border border-accent/40 text-2xl">⤨</div>
            <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">RANDOM PARTY</p>
            <h2 className="text-2xl font-black mt-1 mb-3">랜덤팟</h2>
            <p className="text-muted text-sm mb-4">
              인원과 포지션만 고르면
              <br />
              조건에 맞는 팀원을 바로 찾아드려요.
            </p>
            <i className="not-italic text-accent text-sm font-bold">빠른 매칭 시작 →</i>
          </button>

          <button
            onClick={() => setMode('select')}
            className="p-8 border border-white/10 bg-surface text-left hover:border-accent/40"
          >
            <span className="block text-muted text-xs mb-4">02</span>
            <div className="w-16 h-16 mb-6 grid place-items-center border border-accent/40 text-2xl">▦</div>
            <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">SELECT PARTY</p>
            <h2 className="text-2xl font-black mt-1 mb-3">선택팟</h2>
            <p className="text-muted text-sm mb-4">
              구인글을 살펴보거나
              <br />
              내 조건으로 직접 파티를 만들어보세요.
            </p>
            <i className="not-italic text-accent text-sm font-bold">모집 중인 파티 보기 →</i>
          </button>
        </div>
      )}

      {mode === 'random' && (
        <section className="grid grid-cols-[1fr_auto] gap-10 p-8 border border-white/10 bg-surface items-center max-[760px]:grid-cols-1">
          <div>
            <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">RANDOM QUEUE</p>
            <h2 className="text-2xl font-black mt-1 mb-2">몇 명이 함께할까요?</h2>
            <p className="text-muted text-sm mb-6">원하는 방 크기를 선택하면 비슷한 조건의 플레이어를 찾아요.</p>

            <div className="flex gap-3 mb-6">
              {[2, 3, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => setPartySize(size)}
                  className={
                    partySize === size
                      ? 'w-16 h-16 grid place-items-center border border-accent bg-accent text-ink'
                      : 'w-16 h-16 grid place-items-center border border-white/10 text-muted'
                  }
                >
                  <b className="text-xl">{size}</b>
                  <span className="text-[9px]">인큐</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <label className="grid gap-2 text-muted text-[11px] font-extrabold">
                게임 모드
                <select className="h-11 px-3 border border-white/10 bg-surface-2 text-paper">
                  {['경쟁전', '빠른 대전', '스타디움'].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-muted text-[11px] font-extrabold">
                내 포지션
                <select className="h-11 px-3 border border-white/10 bg-surface-2 text-paper">
                  {['돌격', '공격', '지원', '자유 역할'].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <Button variant="primary" size="wide" onClick={beginMatching} disabled={matching} icon={matching ? '···' : '→'}>
              {matching ? '매칭 중...' : matchDone ? '다시 매칭하기' : '랜덤 매칭 시작'}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative w-56 h-56 grid place-items-center rounded-full border border-accent/30">
              {matching && (
                <>
                  <span className="absolute inset-0 rounded-full border border-accent/40 animate-ping" />
                  <span className="absolute inset-5 rounded-full border border-accent/30 animate-ping [animation-delay:150ms]" />
                  <span className="absolute inset-10 rounded-full border border-accent/20 animate-ping [animation-delay:300ms]" />
                </>
              )}
              <span className="relative z-10 text-xl font-black tracking-widest">
                {matchDone ? 'MATCH!' : matching ? 'SEARCHING' : `${partySize}P`}
              </span>
            </div>

            {matchDone && (
              <div className="w-full p-5 border border-accent/40 bg-accent/10 text-center">
                <b className="block mb-1">팀이 완성됐어요!</b>
                <span className="block text-muted text-xs mb-3">MekaPilot · AimArchive · PulseHeal · +1</span>
                <button onClick={() => onChat(`${partySize}인 랜덤팟`)} className="text-accent text-sm font-bold">
                  그룹 채팅 입장 →
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {mode === 'select' && (
        <>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <Tabs items={partyFilters} active={partyFilter} onChange={setPartyFilter} />
            <Button size="compact" onClick={onCreate} icon="＋">
              파티 만들기
            </Button>
          </div>

          <div className="grid gap-3">
            {filteredParties.map((party) => (
              <article
                key={party.id}
                className="grid grid-cols-[110px_1fr_auto] items-center gap-5 p-5 border border-white/10 bg-surface max-[600px]:grid-cols-[70px_1fr] max-[600px]:[&>button]:col-span-2"
              >
                <div className="text-center">
                  <span className="block text-muted text-[10px]">{party.mode}</span>
                  <b className="text-lg">
                    {party.current}/{party.total}
                  </b>
                </div>
                <div>
                  <h3 className="font-black">{party.title}</h3>
                  <p className="text-muted text-xs mt-1">
                    {party.tier} · {party.voice ? '보이스 ON' : '보이스 자유'}
                  </p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {party.positions.map((position) => (
                      <Tag key={position}>{position} 필요</Tag>
                    ))}
                  </div>
                </div>
                <button onClick={() => onChat(party.title)} className="text-accent text-sm font-bold whitespace-nowrap">
                  참가하기 →
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}