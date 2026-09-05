import { useState } from 'react';
import { CommunityView } from '../features/community/CommunityView';
import { PostModal } from '../features/community/modals/PostModal';
import { useApp } from '../app/outlet-context';

export function CommunityPage() {
  const { posts, setPosts, heroes, likePost, addComment, editComment, deleteComment } = useApp();

  const [communityCategory, setCommunityCategory] =
    useState<'전체' | '빠대용' | '경쟁용' | '스타디움용' | '사설방용' | 'OWCS용' | 'MVP'>('전체');
  const [postOpen, setPostOpen] = useState(false);

  return (
    <>
      <CommunityView
        posts={posts}
        category={communityCategory}
        setCategory={setCommunityCategory}
        onCreate={() => setPostOpen(true)}
        onLike={likePost}
        onCommentAdd={addComment}
        onCommentEdit={editComment}
        onCommentDelete={deleteComment}
        heroes={heroes}
      />

      {postOpen && (
        <PostModal
          onClose={() => setPostOpen(false)}
          onCreate={(post) => {
            setPosts((current) => [post, ...current]);
            setPostOpen(false);
          }}
        />
      )}
    </>
  );
}