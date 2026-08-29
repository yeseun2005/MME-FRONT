import type { ProviderApplication } from '../types/admin';

export const initialApplications: ProviderApplication[] = [
  {
    id: 1,
    applicantId: 'u-1001',
    applicantNickname: 'GenjiMain',
    credential: '상위 500위',
    battletag: 'GenjiMain#3321',
    phone: '010-0000-0000',
    email: 'genji@example.com',
    evidenceFileName: 'rank_proof.png',
    status: '검수 중',
    submittedAt: '2026-08-27 14:20',
  },
  {
    id: 2,
    applicantId: 'u-1002',
    applicantNickname: 'AnaWhisper',
    credential: '프로게이머',
    battletag: 'AnaWhisper#1188',
    phone: '010-1111-2222',
    email: 'ana@example.com',
    evidenceFileName: 'contract.pdf',
    status: '승인',
    submittedAt: '2026-08-20 09:10',
    reviewedAt: '2026-08-21 11:00',
    reviewerId: 'admin-1',
  },
];