import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Tag } from '../../../components/ui/Tag';
import { Button } from '../../../components/ui/Button';
import { HeroImage } from '../../../components/ui/HeroImage';
import type { Comment, Hero, Post } from '../../../types';

const CURRENT_USER = 'MekaPilot';

export function PostDetailModal({
  post,
  heroes,
  onClose,
  onLike,
  onComment,
  onEditComment,
  onDeleteComment,
}: {
  post: Post;
  heroes: Hero[];
  onClose: () => void;
  onLike: (post: Post) => void;
  onComment: (post: Post, body: string) => void;
  onEditComment: (post: Post, commentId: number, body: string) => void;
  onDeleteComment: (post: Post, commentId: number) => void;
}) {
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState('');

  function submitComment() {
    if (!draft.trim()) return;
    onComment(post, draft.trim());
    setDraft('');
  }

  function startEdit(comment: Comment) {
    setEditingId(comment.id);
    setEditDraft(comment.body);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft('');
  }

  function submitEdit(commentId: number) {
    if (!editDraft.trim()) return;
    onEditComment(post, commentId, editDraft.trim());
    cancelEdit();
  }

  function handleDelete(commentId: number) {
    if (window.confirm('댓글을 삭제할까요?')) onDeleteComment(post, commentId);
  }

  return (
    <Modal onClose={onClose} label={post.title}>
      <div className="flex items-center gap-2 mb-3 text-xs">
        <span className="text-accent font-bold">{post.category}</span>
        <i className="not-italic text-muted">{post.time}</i>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <h2 className="text-2xl font-black break-keep flex-1">{post.title}</h2>
        {post.hero && (
          <div className="shrink-0 text-center">
            <HeroImage
              heroes={heroes}
              name={post.hero}
              className="w-11 h-11 rounded-full border border-white/10"
            />
            <span className="block text-muted text-[9px] mt-1">{post.hero}</span>
          </div>
        )}
      </div>

      <p className="text-paper text-sm leading-relaxed whitespace-pre-line mb-6 break-keep">{post.body}</p>

      <div className="flex items-center justify-between border-t border-white/10 pt-4 mb-6">
        <div className="flex items-center gap-3 text-sm">
          <b>{post.author}</b>
          {post.hero && <Tag>{post.hero}</Tag>}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => onLike(post)} className="text-accent text-sm font-bold">
            ▲ <b>{post.likes}</b>
          </button>
          <span className="text-muted text-xs">댓글 {post.comments.length}</span>
        </div>
      </div>

      <div className="border-t border-white/10 pt-5">
        <p className="text-accent text-[11px] font-extrabold tracking-[0.2em] mb-4">
          COMMENTS · {post.comments.length}
        </p>

        <div className="grid gap-3 mb-5 max-h-60 overflow-auto">
          {post.comments.length === 0 ? (
            <p className="text-muted text-xs">아직 댓글이 없어요. 첫 댓글을 남겨보세요.</p>
          ) : (
            post.comments.map((comment) => {
              const isMine = comment.author === CURRENT_USER;
              const isEditing = editingId === comment.id;

              return (
                <div key={comment.id} className="p-3 border border-white/10 bg-surface-2">
                  <div className="flex items-center justify-between mb-1">
                    <b className="text-xs">{comment.author}</b>
                    <div className="flex items-center gap-2">
                      <span className="text-muted text-[10px]">{comment.time}</span>
                      {isMine && !isEditing && (
                        <>
                          <button onClick={() => startEdit(comment)} className="text-muted text-[10px] underline">
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-400 text-[10px] underline"
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        value={editDraft}
                        onChange={(event) => setEditDraft(event.target.value)}
                        onKeyDown={(event) => event.key === 'Enter' && submitEdit(comment.id)}
                        autoFocus
                        className="flex-1 h-9 px-2 border border-white/10 bg-surface text-paper text-sm outline-none focus:border-accent/60"
                      />
                      <button onClick={() => submitEdit(comment.id)} className="text-accent text-xs font-bold px-2">
                        저장
                      </button>
                      <button onClick={cancelEdit} className="text-muted text-xs px-2">
                        취소
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm break-keep">{comment.body}</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && submitComment()}
            placeholder="댓글을 입력하세요"
            className="flex-1 h-11 px-3 border border-white/10 bg-surface-2 text-paper outline-none focus:border-accent/60"
          />
          <Button size="compact" onClick={submitComment}>
            등록
          </Button>
        </div>
      </div>
    </Modal>
  );
}