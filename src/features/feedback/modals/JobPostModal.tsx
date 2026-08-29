import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { FormField, FormGrid } from '../../../components/ui/FormField';
import { Select } from '../../../components/ui/Select';
import type { JobPost } from '../../../types/feedback-extended';

export function JobPostModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (post: Omit<JobPost, 'id' | 'providerId' | 'rating' | 'reviewCount'>) => void;
}) {
  const [intro, setIntro] = useState('');
  const [tier, setTier] = useState('그랜드마스터 1');
  const [position, setPosition] = useState('돌격');
  const [method, setMethod] = useState('영상 리뷰');
  const [price, setPrice] = useState(10000);

  const canSave = intro.trim().length > 0 && price > 0;

  return (
    <Modal label="구인글 작성" onClose={onClose}>
      <h2 className="text-2xl font-black mb-5">구인글 작성</h2>
      <div className="grid gap-4">
        <FormField label="소개">
          <Textarea value={intro} onChange={(event) => setIntro(event.target.value)} placeholder="본인 소개와 피드백 방식을 입력하세요" />
        </FormField>
        <FormGrid>
          <FormField label="자격 티어">
            <Input value={tier} onChange={(event) => setTier(event.target.value)} />
          </FormField>
          <FormField label="포지션">
            <Select value={position} onChange={(event) => setPosition(event.target.value)}>
              <option>돌격</option>
              <option>공격</option>
              <option>지원</option>
            </Select>
          </FormField>
        </FormGrid>
        <FormGrid>
          <FormField label="피드백 방식">
            <Input value={method} onChange={(event) => setMethod(event.target.value)} />
          </FormField>
          <FormField label="가격 (원)">
            <Input type="number" min={0} value={price} onChange={(event) => setPrice(Number(event.target.value))} />
          </FormField>
        </FormGrid>
      </div>
      <Button
        variant="primary"
        size="wide"
        className="mt-6"
        disabled={!canSave}
        onClick={() =>
          onSave({ intro, tier, positions: [position], heroes: [], method, price, status: '게시' })
        }
      >
        게시하기
      </Button>
    </Modal>
  );
}