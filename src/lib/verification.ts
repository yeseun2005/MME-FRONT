const KEY = 'mme-verification';

export type VerificationRecord = {
  type: string;
  status: 'review' | 'approved' | 'rejected';
  proofData: string;
  proofName: string;
  proofMime: string;
  proofSize: number;
  submittedAt: number;
};

export function saveVerification(record: VerificationRecord) {
  localStorage.setItem(KEY, JSON.stringify(record));
}

export function readVerification(): VerificationRecord | null {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as VerificationRecord) : null;
}