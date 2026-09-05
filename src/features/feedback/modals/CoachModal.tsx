// src/features/feedback/modals/CoachModal.tsx
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { money } from '../../../lib/format';
import type { Coach } from '../../../types';
import { CoachImage } from '../../../components/ui/HeroImage';

export function CoachModal({
  coach,
  requested,
  onClose,
  onRequest,
  onChat,
}: {
  coach: Coach;
  requested: boolean;
  onClose: () => void;
  onRequest: () => void;
  onChat: () => void;
}) {
  return (
    <Modal onClose={onClose} label={`${coach.nickname} 피드백 상세`}>
      <div className="flex items-center gap-4 mb-6">
        <CoachImage nickname={coach.nickname} src={coach.image} className="w-20 h-24" />
        <div>
          <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">
            VERIFIED · {coach.credential}
          </p>
          <h2 className="text-2xl font-black mt-1">{coach.nickname}</h2>
          <span className="text-muted text-sm">
            {coach.tier} · {coach.position}
          </span>
        </div>
      </div>

      {requested ? (
        <div className="text-center py-8">
          <span className="text-4xl text-accent">✓</span>
          <h3 className="font-black text-xl mt-3">피드백 신청이 완료됐어요.</h3>
          <p className="text-muted text-sm mt-2 mb-6">
            데모 결제가 승인되었습니다. 제공자와 요청 내용을 이야기해 보세요.
          </p>
          <Button icon="→" onClick={onChat}>
            채팅 시작
          </Button>
        </div>
      ) : (
        <>
          <p className="text-muted text-sm leading-relaxed mb-6">{coach.bio}</p>

          <div className="grid gap-3 mb-6">
            {(
              [
                ['자격 인증', coach.credential === 'PRO' ? '프로게이머 인증' : '상위 500위 챌린저'],
                ['주 영웅', coach.heroes.join(' · ')],
                ['후기', `★ ${coach.rating} / ${coach.reviews}개`],
                ['피드백 방식', '영상 타임라인 + 1:1 채팅'],
                ['가격', `${money(coach.price)}원`],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-muted text-xs">{label}</span>
                <b>{value}</b>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="wide" onClick={onChat}>
              먼저 채팅하기
            </Button>
            <Button variant="primary" size="wide" icon="₩" onClick={onRequest}>
              피드백 신청
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}