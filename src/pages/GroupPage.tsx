import { useState } from 'react';
import { GroupView } from '../features/group/GroupView';
import { PartyModal } from '../features/group/modals/PartyModal';
import { useApp } from '../app/outlet-context';

export function GroupPage() {
  const { parties, setParties, pushNotification, openChat } = useApp();

  const [groupMode, setGroupMode] = useState<'home' | 'random' | 'select'>('home');
  const [partySize, setPartySize] = useState(4);
  const [matching, setMatching] = useState(false);
  const [matchDone, setMatchDone] = useState(false);
  const [partyOpen, setPartyOpen] = useState(false);

  function beginMatching() {
    setMatching(true);
    setMatchDone(false);
    window.setTimeout(() => {
      setMatching(false);
      setMatchDone(true);
      pushNotification('매칭', '팀이 완성됐어요!', `${partySize}인 랜덤팟 매칭이 완료됐어요.`, 'group');
    }, 1100);
  }

  return (
    <>
      <GroupView
        mode={groupMode}
        setMode={setGroupMode}
        partySize={partySize}
        setPartySize={setPartySize}
        matching={matching}
        matchDone={matchDone}
        beginMatching={beginMatching}
        parties={parties}
        onCreate={() => setPartyOpen(true)}
        onChat={openChat}
      />

      {partyOpen && (
        <PartyModal
          onClose={() => setPartyOpen(false)}
          onCreate={(party) => {
            setParties((current) => [party, ...current]);
            setPartyOpen(false);
          }}
        />
      )}
    </>
  );
}