import { useOutletContext } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';
import type { AppNotification, NotificationType } from '../types/notification';
import type { GameRecord, Hero, MetaData, Party, Post, Profile, RecordMode } from '../types';

export type AppOutletContext = {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  logout: () => void;

  heroes: Hero[];
  metaData: MetaData;

  records: Record<string, GameRecord>;
  saveRecord: (date: string, mode: RecordMode, data: Omit<GameRecord, 'date' | 'mode'>) => void;
  deleteRecord: (date: string, mode: RecordMode) => void;
  clearRecords: () => void;

  parties: Party[];
  setParties: Dispatch<SetStateAction<Party[]>>;

  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
  likePost: (post: Post) => void;
  addComment: (post: Post, body: string) => void;
  editComment: (post: Post, commentId: number, body: string) => void;
  deleteComment: (post: Post, commentId: number) => void;

  notify: (title: string, body: string) => void;
  pushNotification: (
    type: NotificationType,
    title: string,
    body: string,
    targetView: AppNotification['targetView'],
  ) => void;

  openChat: (title: string) => void;
};

export function useApp() {
  return useOutletContext<AppOutletContext>();
}