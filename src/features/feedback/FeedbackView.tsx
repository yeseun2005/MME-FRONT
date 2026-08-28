import { PageTitle } from '../../components/layout/PageTitle';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Tag } from '../../components/ui/Tag';
import { Tabs } from '../../components/ui/Tabs';
import { money } from '../../lib/format';
import type { Coach, Profile } from '../../types';

const positionFilters = ['전체', '돌격', '공격', '지원'] as const;

const processSteps = [
  ['01', '제공자 선택', '인증·영웅·후기를 비교하세요.'],
  ['02', '기록과 요청 전달', '보고 싶은 장면과 고민을 남기세요.'],
  ['03', '1:1 피드백', '채팅과 타임라인으로 답을 받아요.'],
] as const;

export function FeedbackView({
  coaches,
  filter,
  setFilter,
  onCoach,
  onChat,
  onVerify,
  profile,
}: {
  coaches: Coach[];
  filter: (typeof positionFilters)[number];
  setFilter: (filter: (typeof positionFilters)[number]) => void;
  onCoach: (coach: Coach) => void;
  onChat: (title: string) => void;
  onVerify: () => void;
  profile: Profile;
}) {
  const filtered = filter === '전체' ? coaches : coaches.filter((coach) => coach.position === filter);
  const statusCopy =
    profile.providerStatus === 'approved'
      ? `${profile.providerType} 인증 완료 · 구인글을 작성할 수 있어요.`
      : profile.providerStatus === 'review'
        ? '제출한 자료를 검토하고 있어요. 보통 1~2일이 걸립니다.'
        : '상위 500위 챌린저 또는 프로게이머라면 자격 인증을 신청할 수 있어요.';

  return (
    <div className="max-w-[1040px] mx-auto py-12 px-4">
      <PageTitle
        eyebrow="COACHING MARKET"
        title="검증된 플레이어와"
        accent="성장하세요."
        description="상위 500위 챌린저와 프로게이머에게 결정적인 장면을 피드백 받으세요."
        action={
          <div className="flex gap-1.5 max-[760px]:w-full">
            <Button variant="outline" size="compact" onClick={onVerify} className="max-[760px]:flex-1">
              자격 인증 ↗
            </Button>
            <Button
              size="compact"
              disabled={profile.providerStatus !== 'approved'}
              className="max-[760px]:flex-1"
              icon="＋"
            >
              구인글 쓰기
            </Button>
          </div>
        }
      />

      <section className="flex items-center gap-4 p-5 mb-8 border border-white/10 bg-surface">
        <div className="w-9 h-9 grid place-items-center rounded-full border border-white/20 text-sm">
          {profile.providerStatus === 'review' ? '…' : '✓'}
        </div>
        <div className="flex-1">
          <b className="block">피드백 제공자 자격</b>
          <p className="text-muted text-xs mt-1">{statusCopy}</p>
        </div>
        <button onClick={onVerify} className="text-accent text-xs font-bold">
          {profile.providerStatus === 'none' ? '인증 신청' : '상태 확인'}
        </button>
      </section>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Tabs items={positionFilters} active={filter} onChange={setFilter} />
        <span className="text-muted text-[10px]">{filtered.length}명의 검증된 제공자</span>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-14 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {filtered.map((coach) => (
          <Card key={coach.id} className="group">
            <div className="relative h-56 overflow-hidden">
              <img
                src={coach.image}
                alt=""
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <Tag variant={coach.credential === 'PRO' ? 'pro' : 'verified'} className="absolute left-3.5 top-3.5">
                ✓ {coach.credential}
              </Tag>
              <button
                onClick={() => onChat(coach.nickname)}
                className="absolute right-3.5 bottom-3.5 px-3 py-1.5 bg-black/60 text-white text-[10px] font-extrabold"
              >
                CHAT
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-black">{coach.nickname}</h3>
                  <span className="text-muted text-xs">
                    {coach.tier} · {coach.position}
                  </span>
                </div>
                <b className="text-accent">★ {coach.rating}</b>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {coach.heroes.map((hero) => (
                  <Tag key={hero}>{hero}</Tag>
                ))}
              </div>
              <p className="text-muted text-xs leading-relaxed mb-4">{coach.bio}</p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span>
                  <small className="block text-muted text-[9px]">1회 피드백</small>
                  <b>{money(coach.price)}원부터</b>
                </span>
                <button onClick={() => onCoach(coach)} className="text-accent text-xs font-bold">
                  상세 보기 →
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <section className="p-8 border border-white/10 text-center">
        <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">HOW IT WORKS</p>
        <h2 className="font-black text-2xl mt-2 mb-8">피드백은 이렇게 진행돼요.</h2>
        <div className="grid grid-cols-3 gap-6 max-[600px]:grid-cols-1">
          {processSteps.map(([num, title, copy]) => (
            <div key={num}>
              <span className="block text-accent text-2xl font-black mb-2">{num}</span>
              <h3 className="font-bold mb-1">{title}</h3>
              <p className="text-muted text-xs">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}