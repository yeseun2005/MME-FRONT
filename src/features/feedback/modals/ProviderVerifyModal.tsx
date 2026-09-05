import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { FormField, FormGrid } from '../../../components/ui/FormField';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { MAX_PROOF_BYTES, fileToDataUrl, formatBytes, validateProofFile } from '../../../lib/file';
import { saveVerification } from '../../../lib/verification';
import type { Profile } from '../../../types';

const credentialOptions = [
  { value: '상위 500위', glyph: '500', hint: '챌린저 순위와 시즌 증빙' },
  { value: '프로게이머', glyph: 'PRO', hint: '소속·대회 경력 증빙' },
] as const;

type Stage = 'form' | 'review' | 'approved' | 'rejected';

function initialStage(status: Profile['providerStatus']): Stage {
  if (status === 'review') return 'review';
  if (status === 'rejected') return 'rejected';
  if (status === 'approved') return 'approved';
  return 'form';
}

export function ProviderVerifyModal({
  profile,
  setProfile,
  onClose,
}: {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<Stage>(initialStage(profile.providerStatus));
  const [type, setType] = useState<'상위 500위' | '프로게이머'>(profile.providerType || '상위 500위');
  const [nickname, setNickname] = useState(profile.nickname);
  const [battletag, setBattletag] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function submitVerification() {
    setSubmitError('');
    if (!battletag.trim() || !phone.trim() || !email.trim()) {
      setSubmitError('배틀태그, 전화번호, 이메일을 모두 입력해 주세요.');
      return;
    }
    if (!/^.{3,12}#\d{4,6}$/.test(battletag.trim())) {
      setSubmitError('배틀태그는 Player#1234 형식으로 입력해 주세요.');
      return;
    }
    if (!/^01[016-9]-?\d{3,4}-?\d{4}$/.test(phone.replace(/\s/g, ''))) {
      setSubmitError('전화번호는 010-0000-0000 형식으로 입력해 주세요.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setSubmitError('올바른 이메일 주소를 입력해 주세요.');
      return;
    }
    if (!proofFile) {
      setSubmitError('검수할 증빙 파일을 첨부해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const proof = await fileToDataUrl(proofFile);
      saveVerification({
        type,
        nickname,
        battletag,
        phone,
        email,
        status: 'review',
        proofData: proof.dataUrl,
        proofName: proof.name,
        proofMime: proof.mime,
        proofSize: proof.size,
        submittedAt: Date.now(),
      });
      setProfile((current) => ({
        ...current,
        providerStatus: 'review',
        providerType: type,
        providerRejectReason: undefined,
      }));
      setStage('review');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '인증 신청을 저장하지 못했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === 'review') {
    return (
      <Modal onClose={onClose} label="피드백 제공자 인증 상태">
        <div className="text-center py-8">
          <span className="text-3xl text-accent">…</span>
          <p className="text-accent text-[11px] font-extrabold tracking-[0.2em] mt-3">VERIFICATION IN REVIEW</p>
          <h3 className="font-black text-xl mt-2">자격 자료를 검토하고 있어요.</h3>
          <p className="text-muted text-sm mt-2">
            {type} 인증 신청이 접수됐습니다.
            <br />
            운영자 검수 후 결과를 알려드려요.
          </p>
          <Button className="mt-6" onClick={onClose}>
            확인
          </Button>
        </div>
      </Modal>
    );
  }

  if (stage === 'approved') {
    return (
      <Modal onClose={onClose} label="피드백 제공자 인증 완료">
        <div className="text-center py-8">
          <span className="text-3xl text-accent">✓</span>
          <p className="text-accent text-[11px] font-extrabold tracking-[0.2em] mt-3">VERIFICATION APPROVED</p>
          <h3 className="font-black text-xl mt-2">이미 인증이 완료됐어요.</h3>
          <p className="text-muted text-sm mt-2">
            {profile.providerType} 자격으로 승인됐습니다.
            <br />
            피드백 페이지에서 구인글을 작성할 수 있어요.
          </p>
          <Button className="mt-6" onClick={onClose}>
            확인
          </Button>
        </div>
      </Modal>
    );
  }

  if (stage === 'rejected') {
    return (
      <Modal onClose={onClose} label="피드백 제공자 인증 반려">
        <div className="text-center py-8">
          <span className="text-3xl text-red-400">✕</span>
          <p className="text-red-400 text-[11px] font-extrabold tracking-[0.2em] mt-3">VERIFICATION REJECTED</p>
          <h3 className="font-black text-xl mt-2">신청이 반려됐어요.</h3>
          <p className="text-muted text-sm mt-2 mb-1">반려 사유</p>
          <p className="text-paper text-sm border border-red-400/30 bg-red-400/5 px-4 py-3 mx-auto max-w-[420px]">
            {profile.providerRejectReason || '사유가 등록되지 않았습니다.'}
          </p>
          <Button className="mt-6" onClick={() => setStage('form')} icon="→">
            자료 보완 후 재신청
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} label="피드백 제공자 인증">
      <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">PROVIDER VERIFICATION</p>
      <h2 className="text-2xl font-black mt-1 mb-3">피드백 제공자 인증</h2>
      <p className="text-muted text-sm leading-relaxed mb-6">
        넥슨 계정 인증과 별도로 상위 500위 챌린저 또는 프로게이머 자격을 운영자가 검수합니다.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {credentialOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setType(option.value)}
            className={
              type === option.value
                ? 'p-4 border border-accent bg-accent/10 text-left'
                : 'p-4 border border-white/10 text-left'
            }
          >
            <span className="block text-accent text-xs font-black mb-1">{option.glyph}</span>
            <b className="block">{option.value}</b>
            <small className="text-muted text-xs">{option.hint}</small>
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        <FormGrid>
          <FormField label="배틀태그">
            <Input
              placeholder="Player#1234"
              value={battletag}
              onChange={(event) => setBattletag(event.target.value)}
            />
          </FormField>
          <FormField label="활동 닉네임">
            <Input value={nickname} onChange={(event) => setNickname(event.target.value)} />
          </FormField>
        </FormGrid>

        <FormGrid>
          <FormField label="전화번호">
            <Input placeholder="010-0000-0000" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </FormField>
          <FormField label="이메일">
            <Input
              type="email"
              placeholder="player@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormField>
        </FormGrid>

        <label className="grid place-items-center gap-1 min-h-[120px] p-5 border border-dashed border-accent/40 cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              const invalid = file ? validateProofFile(file) : null;
              if (invalid) {
                setProofFile(null);
                setSubmitError(invalid);
                event.target.value = '';
                return;
              }
              setProofFile(file);
              setSubmitError('');
            }}
          />
          <span className="text-accent text-3xl">＋</span>
          <b className="text-paper text-[11px]">{proofFile?.name || '순위 또는 선수 경력 증빙 추가'}</b>
          <small className="text-[#707078] text-[8px]">
            JPG·PNG·WEBP·PDF · 최대 {formatBytes(MAX_PROOF_BYTES)} · 관리자만 열람
          </small>
        </label>

        {submitError && (
          <p role="alert" className="text-red-400 text-xs">
            {submitError}
          </p>
        )}

        <Button variant="primary" size="wide" disabled={submitting} onClick={submitVerification} icon="→">
          {submitting ? '제출 중...' : '인증 신청하기'}
        </Button>
      </div>
    </Modal>
  );
}