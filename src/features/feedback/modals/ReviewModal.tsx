import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';

export function ReviewModal({
  providerNickname,
  onClose,
  onSubmit,
}: {
  providerNickname: string;
  onClose: () => void;
  onSubmit: (rating: number, body: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');

  return (
    <Modal label="후기 작성" onClose={onClose}>
      <h2 className="text-2xl font-black mb-1">{providerNickname} 후기</h2>
      <p className="text-muted text-[12px] mb-5">완료된 피드백에 대한 평점과 후기를 남겨주세요. (1회만 작성 가능)</p>

      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => setRating(value)}
            aria-label={`${value}점`}
            className={`w-10 h-10 border text-lg ${
              value <= rating ? 'border-accent bg-accent text-ink' : 'border-white/10 text-muted'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="후기를 입력하세요" />

      <Button
        variant="primary"
        size="wide"
        className="mt-5"
        disabled={!body.trim()}
        onClick={() => onSubmit(rating, body)}
      >
        후기 등록
      </Button>
    </Modal>
  );
}