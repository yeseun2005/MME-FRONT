import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { FormField, FormGrid } from '../../../components/ui/FormField';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import type { Party } from '../../../types';

export function PartyModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (party: Party) => void;
}) {
  const [title, setTitle] = useState('같이 즐겜하실 분!');

  function handleCreate() {
    onCreate({
      id: Date.now(),
      title,
      mode: '경쟁전',
      tier: '플래티넘 이상',
      current: 1,
      total: 5,
      positions: ['지원'],
      voice: true,
    });
  }

  return (
    <Modal onClose={onClose} label="파티 만들기">
      <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">CREATE PARTY</p>
      <h2 className="text-2xl font-black mt-1 mb-6">선택팟 만들기</h2>

      <div className="grid gap-4">
        <FormField label="방 제목">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </FormField>

        <FormGrid>
          <FormField label="게임 모드">
            <Select>
              {['경쟁전', '빠른 대전', '스타디움'].map((mode) => (
                <option key={mode}>{mode}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="목표 인원">
            <Select>
              {['5명', '4명', '3명'].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </Select>
          </FormField>
        </FormGrid>

        <FormField label="필요 포지션">
          <Select>
            {['지원', '공격', '돌격', '자유 역할'].map((position) => (
              <option key={position}>{position}</option>
            ))}
          </Select>
        </FormField>

        <Button variant="primary" size="wide" icon="→" onClick={handleCreate}>
          모집 시작
        </Button>
      </div>
    </Modal>
  );
}