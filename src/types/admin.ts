export type ApplicationStatus = '검수 중' | '승인' | '반려';
export type ProviderCredential = '상위 500위' | '프로게이머';

export type ProviderApplication = {
  id: number;
  applicantId: string;
  isMine?: boolean;
  applicantNickname: string;
  credential: ProviderCredential;
  battletag: string;
  phone: string;
  email: string;
  evidenceFileName: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  rejectReason?: string;
};

export type AdminSummary = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};