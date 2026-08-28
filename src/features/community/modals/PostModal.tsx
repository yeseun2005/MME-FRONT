import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import type { Post } from '../../../types';

const categories = ['빠대용', '경쟁용', '스타디움용', '사설방용', 'OWCS용'];

export function PostModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (post: Post) => void;
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('경쟁용');

  function handleSubmit() {
    if (!title.trim()) return;
    onCreate({
        id: Date.now(),
        category,
        title,
        author: 'MekaPilot',
        time: '방금 전',
        likes: 0,
        comments: [],
        body,
    });
    }

  return (
    <Modal onClose={onClose} label="커뮤니티 글쓰기">
      <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">NEW COMMUNITY POST</p>
      <h2 className="text-2xl font-black mt-1 mb-6">새 글 작성</h2>

      <div className="grid gap-4">
        <FormField label="카테고리">
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="제목">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목을 입력하세요" />
        </FormField>

        <FormField label="내용">
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="플레이어들과 나눌 이야기를 적어주세요"
          />
        </FormField>

        <Button variant="primary" size="wide" icon="↑" onClick={handleSubmit}>
          게시하기
        </Button>
      </div>
    </Modal>
  );
}