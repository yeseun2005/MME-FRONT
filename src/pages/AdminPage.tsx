import { AdminView } from '../features/admin/AdminView';
import { useApp } from '../app/outlet-context';

export function AdminPage() {
  const { setProfile, pushNotification } = useApp();

  return (
    <AdminView
      onResolved={(result) => {
        if (!result.isMine) return;
        setProfile((current) => ({
          ...current,
          providerStatus: result.status === '승인' ? 'approved' : 'rejected',
          providerType: result.status === '승인' ? result.credential : current.providerType,
          providerRejectReason: result.status === '반려' ? result.reason : undefined,
        }));
        pushNotification(
          '검수결과',
          result.status === '승인' ? '제공자 인증이 승인됐어요' : '제공자 인증이 반려됐어요',
          result.status === '승인'
            ? `${result.credential} 자격으로 구인글을 작성할 수 있어요.`
            : result.reason || '사유를 확인하고 다시 신청해 주세요.',
          // 반려는 재신청 버튼이 있는 피드백 화면으로, 승인은 인증 배지가 뜨는 프로필로 보낸다.
          result.status === '승인' ? 'profile' : 'feedback',
        );
      }}
    />
  );
}