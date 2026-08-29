import { useState } from 'react';
import { initialApplications } from '../constants/admin-mock';
import { readVerification, resolveVerification } from '../lib/verification';
import type { ApplicationStatus, ProviderApplication } from '../types/admin';

const REAL_APPLICATION_ID = 9000;

const statusMap: Record<'review' | 'approved' | 'rejected', ApplicationStatus> = {
  review: '검수 중',
  approved: '승인',
  rejected: '반려',
};

function loadRealApplication(): ProviderApplication | null {
  const record = readVerification();
  if (!record) return null;
  return {
    id: REAL_APPLICATION_ID,
    applicantId: 'local-user',
    isMine: true,
    applicantNickname: record.nickname,
    credential: record.type as ProviderApplication['credential'],
    battletag: record.battletag,
    phone: record.phone,
    email: record.email,
    evidenceFileName: record.proofName,
    status: statusMap[record.status],
    submittedAt: new Date(record.submittedAt).toLocaleString('ko-KR'),
    reviewedAt: record.reviewedAt ? new Date(record.reviewedAt).toLocaleString('ko-KR') : undefined,
    rejectReason: record.rejectReason,
  };
}

export type ResolvedApplication = {
  applicantNickname: string;
  credential: ProviderApplication['credential'];
  status: '승인' | '반려';
  reason?: string;
  isMine: boolean;
};

export function useProviderApplications(onResolved?: (result: ResolvedApplication) => void) {
  const [applications, setApplications] = useState<ProviderApplication[]>(() => {
    const real = loadRealApplication();
    return real ? [real, ...initialApplications] : initialApplications;
  });

  const summary = {
    total: applications.length,
    pending: applications.filter((item) => item.status === '검수 중').length,
    approved: applications.filter((item) => item.status === '승인').length,
    rejected: applications.filter((item) => item.status === '반려').length,
  };

  function approve(id: number, reviewerId = 'admin-1') {
    const target = applications.find((item) => item.id === id);
    setApplications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: '승인', reviewerId, reviewedAt: new Date().toLocaleString('ko-KR') }
          : item,
      ),
    );
    const isMine = id === REAL_APPLICATION_ID;
    if (isMine) resolveVerification('approved');
    if (target) onResolved?.({ applicantNickname: target.applicantNickname, credential: target.credential, status: '승인', isMine });
  }

  function reject(id: number, reason: string, reviewerId = 'admin-1') {
    if (!reason.trim()) return;
    const target = applications.find((item) => item.id === id);
    setApplications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: '반려',
              rejectReason: reason,
              reviewerId,
              reviewedAt: new Date().toLocaleString('ko-KR'),
            }
          : item,
      ),
    );
    const isMine = id === REAL_APPLICATION_ID;
    if (isMine) resolveVerification('rejected', reason);
    if (target) onResolved?.({ applicantNickname: target.applicantNickname, credential: target.credential, status: '반려', reason, isMine });
  }

  return { applications, summary, approve, reject };
}