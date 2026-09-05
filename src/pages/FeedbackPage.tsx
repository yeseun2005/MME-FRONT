import { useState } from 'react';
import { FeedbackView } from '../features/feedback/FeedbackView';
import { CoachModal } from '../features/feedback/modals/CoachModal';
import { ProviderVerifyModal } from '../features/feedback/modals/ProviderVerifyModal';
import { JobPostModal } from '../features/feedback/modals/JobPostModal';
import { useApp } from '../app/outlet-context';
import { coaches } from '../constants/mock';
import type { Coach } from '../types';

export function FeedbackPage() {
  const { profile, setProfile, notify, pushNotification, openChat } = useApp();

  const [coachFilter, setCoachFilter] = useState<'전체' | '돌격' | '공격' | '지원'>('전체');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [feedbackRequested, setFeedbackRequested] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [jobPostOpen, setJobPostOpen] = useState(false);

  return (
    <>
      <FeedbackView
        coaches={coaches}
        filter={coachFilter}
        setFilter={setCoachFilter}
        onCoach={setSelectedCoach}
        onChat={openChat}
        onVerify={() => setVerificationOpen(true)}
        onWriteJobPost={() => setJobPostOpen(true)}
        profile={profile}
      />

      {selectedCoach && (
        <CoachModal
          coach={selectedCoach}
          requested={feedbackRequested}
          onClose={() => {
            setSelectedCoach(null);
            setFeedbackRequested(false);
          }}
          onRequest={() => {
            setFeedbackRequested(true);
            pushNotification(
              '피드백',
              '피드백 요청이 접수됐어요',
              `${selectedCoach.nickname} 코치에게 요청을 보냈어요.`,
              'feedback',
            );
          }}
          onChat={() => {
            openChat(selectedCoach.nickname);
            setSelectedCoach(null);
          }}
        />
      )}

      {verificationOpen && (
        <ProviderVerifyModal profile={profile} setProfile={setProfile} onClose={() => setVerificationOpen(false)} />
      )}

      {jobPostOpen && (
        <JobPostModal
          onClose={() => setJobPostOpen(false)}
          onSave={() => {
            notify('구인글이 게시되었습니다.', '피드백 제공자 목록에 반영되었습니다.');
            setJobPostOpen(false);
          }}
        />
      )}
    </>
  );
}