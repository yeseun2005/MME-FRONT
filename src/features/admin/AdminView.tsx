import { useState } from 'react';
import { PageTitle } from '../../components/layout/PageTitle';
import { Card } from '../../components/ui/Card';
import { Tag } from '../../components/ui/Tag';
import { ApplicationDetailModal } from './modals/ApplicationDetailModal';
import { useProviderApplications } from '../../hooks/useProviderApplications';
import type { ResolvedApplication } from '../../hooks/useProviderApplications';
import type { ApplicationStatus, ProviderApplication } from '../../types/admin';

const filters: Array<'전체' | ApplicationStatus> = ['전체', '검수 중', '승인', '반려'];

export function AdminView({ onResolved }: { onResolved?: (result: ResolvedApplication) => void }) {
  const { applications, summary, approve, reject } = useProviderApplications(onResolved);
  const [filter, setFilter] = useState<'전체' | ApplicationStatus>('전체');
  const [selected, setSelected] = useState<ProviderApplication | null>(null);

  const filtered = filter === '전체' ? applications : applications.filter((item) => item.status === filter);

  return (
    <div>
      <PageTitle
        eyebrow="ADMIN"
        title="인증 검수"
        accent="현황"
        description="제공자 자격 인증 신청을 확인하고 승인 또는 반려 처리합니다."
      />

      <div className="grid grid-cols-4 gap-3 mb-6 max-[600px]:grid-cols-2">
        <Stat label="전체" value={summary.total} />
        <Stat label="검수 대기" value={summary.pending} />
        <Stat label="승인" value={summary.approved} />
        <Stat label="반려" value={summary.rejected} />
      </div>

      <div className="flex gap-2 mb-5 overflow-auto">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={
              filter === item
                ? 'shrink-0 px-4 py-2.5 border border-accent bg-accent text-ink text-[12px] font-extrabold'
                : 'shrink-0 px-4 py-2.5 border border-white/10 text-muted text-[12px] font-extrabold'
            }
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted py-16">해당 상태의 신청이 없습니다.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <Card key={item.id} className="p-5 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setSelected(item)}>
                            <div>
                <p className="font-black flex items-center gap-2">
                  {item.applicantNickname}
                  {item.isMine && <Tag variant="verified">MY REQUEST</Tag>}
                </p>
                <p className="text-muted text-[12px]">
                  {item.credential} · {item.submittedAt}
                </p>
              </div>
              <Tag variant={item.status === '승인' ? 'verified' : item.status === '반려' ? 'default' : 'readonly'}>
                {item.status}
              </Tag>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <ApplicationDetailModal
          application={selected}
          onClose={() => setSelected(null)}
          onApprove={(id) => {
            approve(id);
            setSelected(null);
          }}
          onReject={(id, reason) => reject(id, reason)}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4 text-center">
      <p className="text-3xl font-black text-accent">{value}</p>
      <p className="text-muted text-[10px] font-extrabold tracking-widest mt-1">{label}</p>
    </Card>
  );
}