const KEY = 'mme-verification';

export type VerificationRecord = {
  type: string;
  nickname: string;
  battletag: string;
  phone: string;
  email: string;
  status: 'review' | 'approved' | 'rejected';
  proofData: string;
  proofName: string;
  proofMime: string;
  proofSize: number;
  submittedAt: number;
  reviewedAt?: number;
  rejectReason?: string;
};

export function saveVerification(record: VerificationRecord) {
  try {
    localStorage.setItem(KEY, JSON.stringify(record));
  } catch (error) {
    const quotaExceeded =
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED');
    if (quotaExceeded) {
      throw new Error('저장 공간이 부족합니다. 더 작은 증빙 파일로 다시 시도해 주세요.');
    }
    throw error;
  }
}

export function readVerification(): VerificationRecord | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VerificationRecord;
  } catch {
    localStorage.removeItem(KEY);
    return null;
  }
}

export function resolveVerification(status: 'approved' | 'rejected', rejectReason?: string) {
  const current = readVerification();
  if (!current) return;
  saveVerification({ ...current, status, rejectReason, reviewedAt: Date.now() });
}