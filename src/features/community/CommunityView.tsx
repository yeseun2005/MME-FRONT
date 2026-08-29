import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { PageTitle } from '../../components/layout/PageTitle';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { heroImage } from '../../lib/format';
import { PostDetailModal } from './modals/PostDetailModal';
import type { Hero, Post } from '../../types';

const categories = ['전체', '빠대용', '경쟁용', '스타디움용', '사설방용', 'OWCS용', 'MVP'] as const;
const trendingHeroes = ['D.Va', '아나', 'D.Mon', '트레이서'];

function tabGlyph(item: string) {
  if (item === '전체') return 'ALL';
  if (item === 'OWCS용') return 'ESPORTS';
  if (item === 'MVP') return '00:00 / 12:00';
  return item.slice(0, 2).toUpperCase();
}

export function CommunityView({
  posts,
  category,
  setCategory,
  onCreate,
  onLike,
  onCommentAdd,
  onCommentEdit,
  onCommentDelete,
  heroes,
}: {
  posts: Post[];
  category: (typeof categories)[number];
  setCategory: (category: (typeof categories)[number]) => void;
  onCreate: () => void;
  onLike: (post: Post) => void;
  onCommentAdd: (post: Post, body: string) => void;
  onCommentEdit: (post: Post, commentId: number, body: string) => void;
  onCommentDelete: (post: Post, commentId: number) => void;
  heroes: Hero[];
}) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const mvpPosts = posts
    .slice()
    .sort((a, b) => b.likes * 2 + b.comments.length - (a.likes * 2 + a.comments.length))
    .slice(0, 5);
  const filtered = category === '전체' ? posts : category === 'MVP' ? mvpPosts : posts.filter((post) => post.category === category);
  const isMvp = category === 'MVP';

  return (
    <div className="max-w-[88vw] xl:max-w-[1240px] mx-auto py-12 px-4">
      <PageTitle
        eyebrow="PLAYER COMMUNITY"
        title="플레이의 답은"
        accent="플레이어에게."
        description="다섯 게시판의 이야기와 자동 선정된 MVP 글을 한곳에서 만나보세요."
        action={
          !isMvp ? (
            <Button size="compact" icon="＋" onClick={onCreate}>
              글쓰기
            </Button>
          ) : (
            <Tag variant="readonly">READ ONLY · AUTO CURATED</Tag>
          )
        }
      />

      <div className="flex gap-2 overflow-auto mb-6 pb-1">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={
              category === item
                ? `shrink-0 px-4 py-2.5 border ${item === 'MVP' ? 'border-[#d856ff] bg-[#d856ff]/10' : 'border-accent bg-accent text-ink'}`
                : 'shrink-0 px-4 py-2.5 border border-white/10 text-muted'
            }
          >
            <span className="block text-[8px] font-extrabold tracking-widest opacity-70">{tabGlyph(item)}</span>
            {item}
          </button>
        ))}
      </div>

      {isMvp && (
        <section className="flex items-center justify-between p-6 mb-6 border border-[#d856ff]/40 bg-[#d856ff]/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-[#d856ff]">★</span>
            <div>
              <p className="text-[#d856ff] text-[11px] font-extrabold tracking-[0.2em]">MMe MVP BOARD</p>
              <h2 className="font-black">좋아요와 댓글이 만든 오늘의 플레이북</h2>
            </div>
          </div>
          <div className="text-right">
            <b className="block text-muted text-xs">다음 집계</b>
            <strong className="text-xl">12:00</strong>
            <small className="block text-muted text-[10px]">좋아요 ×2 + 댓글 ×1</small>
          </div>
        </section>
      )}

      <div className="grid grid-cols-[1fr_280px] gap-6 items-start max-[900px]:grid-cols-1">
        <div className="grid gap-3 h-fit">
          {filtered.map((post, index) => (
            <Card
              key={post.id}
              className={`p-5 flex gap-4 cursor-pointer hover:border-accent/40 ${index === 0 ? 'border-accent/40' : ''}`}
              onClick={() => setSelectedPost(post)}
            >
              <div className="text-muted text-xl font-black w-8 shrink-0">{String(index + 1).padStart(2, '0')}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="text-accent font-bold">{isMvp ? 'MVP SELECTED' : post.category}</span>
                  <i className="not-italic text-muted">{post.time}</i>
                  {isMvp && <b className="text-[#d856ff]">SCORE {post.likes * 2 + post.comments.length}</b>}
                </div>
                <h3 className="font-black mb-1 break-keep">{post.title}</h3>
                <p className="text-muted text-sm mb-2 line-clamp-2 break-keep">{post.body}</p>
                <div className="flex items-center gap-2 text-xs">
                  <b>{post.author}</b>
                  <span className="text-muted">{post.category}</span>
                  {post.hero && <Tag>{post.hero}</Tag>}
                </div>
              </div>
              {post.hero && heroImage(heroes, post.hero) && (
                <img src={heroImage(heroes, post.hero)} alt="" className="w-16 h-16 object-cover shrink-0" />
              )}
              <div className="flex flex-col items-end justify-between shrink-0">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onLike(post);
                  }}
                  className="text-accent text-sm font-bold"
                >
                  ▲ <b>{post.likes}</b>
                </button>
                <span className="text-muted text-xs">댓글 {post.comments.length}</span>
              </div>
            </Card>
          ))}
        </div>

        <aside className="p-5 border border-white/10 bg-surface h-fit">
          <p className="text-accent text-[11px] font-extrabold tracking-[0.2em]">TRENDING HEROES</p>
          <h3 className="font-black mt-1 mb-4">지금 많이 이야기해요</h3>
          <div className="grid gap-3">
            {trendingHeroes.map((name, index) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-muted text-xs">0{index + 1}</span>
                {heroImage(heroes, name) && (
                  <img src={heroImage(heroes, name)} alt="" className="w-8 h-8 object-cover" />
                )}
                <b className="flex-1">{name}</b>
                <i className="not-italic text-accent">↗</i>
              </div>
            ))}
          </div>
          <p className="text-muted text-sm italic mt-6 leading-relaxed">
            "좋은 플레이는
            <br />
            함께할 때 더 오래 남는다."
          </p>
        </aside>
      </div>

      {selectedPost && (
        <PostDetailModal
            post={selectedPost}
            heroes={heroes}
            onClose={() => setSelectedPost(null)}
            onLike={(post) => {
            onLike(post);
            setSelectedPost((current) => (current ? { ...current, likes: current.likes + 1 } : current));
            }}
            onComment={(post, body) => {
            onCommentAdd(post, body);
            setSelectedPost((current) =>
                current
                ? {
                    ...current,
                    comments: [...current.comments, { id: Date.now(), author: 'MekaPilot', body, time: '방금 전' }],
                    }
                : current,
            );
            }}
            onEditComment={(post, commentId, body) => {
            onCommentEdit(post, commentId, body);
            setSelectedPost((current) =>
                current
                ? {
                    ...current,
                    comments: current.comments.map((comment) =>
                        comment.id === commentId ? { ...comment, body } : comment,
                    ),
                    }
                : current,
            );
            }}
            onDeleteComment={(post, commentId) => {
            onCommentDelete(post, commentId);
            setSelectedPost((current) =>
                current ? { ...current, comments: current.comments.filter((comment) => comment.id !== commentId) } : current,
            );
            }}
        />
        )}
    </div>
  );
}