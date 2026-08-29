import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import type { Party } from '../../../types';

export function PartyManageModal({
  party,
  members,
  onClose,
  onCloseRecruit,
  onDisband,
  onKick,
  onReport,
}: {
  party: Party;
  members: string[];
  onClose: () => void;
  onCloseRecruit: () => void;
  onDisband: () => void;
  onKick: (nickname: string) => void;
  onReport: (nickname: string) => void;
}) {
  const [confirmingDisband, setConfirmingDisband] = useState(false);

  return (
    <Modal label="파티 관리" onClose={onClose}>
      <h2 className="text-2xl font-black mb-1">{party.title}</h2>
      <p className="text-muted text-[12px] mb-5">
        {party.mode} · {party.current}/{party.total}명 · 방장 전용 관리 화면입니다.
      </p>

      <div className="grid gap-2 mb-6">
        {members.map((nickname) => (
          <div key={nickname} className="flex items-center justify-between border border-white/10 px-4 py-3">
            <span className="font-bold">{nickname}</span>
            <div className="flex gap-2">
              <button onClick={() => onKick(nickname)} className="text-red-400 text-[11px] font-extrabold">
                내보내기
              </button>
              <button onClick={() => onReport(nickname)} className="text-muted text-[11px] font-extrabold">
                신고
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 max-[500px]:flex-col">
        <Button variant="outline" onClick={onCloseRecruit}>
          모집 마감
        </Button>
        {confirmingDisband ? (
          <Button variant="danger" onClick={onDisband}>
            정말 해산하시겠습니까? (확정)
          </Button>
        ) : (
          <Button variant="danger" onClick={() => setConfirmingDisband(true)}>
            파티 해산
          </Button>
        )}
      </div>
    </Modal>
  );
}