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
  localStorage.setItem(KEY, JSON.stringify(record));
}

export function readVerification(): VerificationRecord | null {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as VerificationRecord) : null;
}

export function resolveVerification(status: 'approved' | 'rejected', rejectReason?: string) {
  const current = readVerification();
  if (!current) return;
  saveVerification({ ...current, status, rejectReason, reviewedAt: Date.now() });
}