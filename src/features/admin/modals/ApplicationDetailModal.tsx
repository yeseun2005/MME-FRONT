import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { Tag } from '../../../components/ui/Tag';
import type { ProviderApplication } from '../../../types/admin';

export function ApplicationDetailModal({
  application,
  onClose,
  onApprove,
  onReject,
}: {
  application: ProviderApplication;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  const pending = application.status === '검수 중';

  return (
    <Modal label="제공자 인증 신청 상세" onClose={onClose}>
      <p className="text-accent text-[11px] font-extrabold tracking-[0.2em] mb-2">APPLICATION #{application.id}</p>
      <h2 className="text-2xl font-black mb-4">{application.applicantNickname}</h2>

      <div className="grid grid-cols-2 gap-3 text-[13px] mb-5 max-[600px]:grid-cols-1">
        <Row label="자격" value={application.credential} />
        <Row label="배틀태그" value={application.battletag} />
        <Row label="연락처" value={application.phone} />
        <Row label="이메일" value={application.email} />
        <Row label="증빙 파일" value={application.evidenceFileName} />
        <Row label="제출 시각" value={application.submittedAt} />
        {application.reviewedAt && <Row label="검수 시각" value={application.reviewedAt} />}
        {application.reviewerId && <Row label="검수자" value={application.reviewerId} />}
      </div>

      <div className="mb-5">
        <Tag variant={application.status === '승인' ? 'verified' : application.status === '반려' ? 'default' : 'readonly'}>
          {application.status}
        </Tag>
        {application.rejectReason && (
          <p className="mt-2 text-red-400 text-[12px]">반려 사유: {application.rejectReason}</p>
        )}
      </div>

      {pending && (
        <>
          <FormLabel label="반려 사유 (반려 시 필수)">
            <Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="반려 사유를 입력하세요" />
          </FormLabel>
          <div className="flex gap-3 mt-4 max-[500px]:flex-col">
            <Button variant="primary" onClick={() => onApprove(application.id)}>
              승인
            </Button>
            <Button
              variant="danger"
              disabled={!reason.trim()}
              onClick={() => {
                onReject(application.id, reason);
                onClose();
              }}
            >
              반려
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted text-[10px] font-extrabold tracking-widest">{label}</p>
      <p className="text-paper font-bold">{value}</p>
    </div>
  );
}

function FormLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-muted text-[11px] font-extrabold tracking-wide">
      {label}
      {children}
    </label>
  );
}