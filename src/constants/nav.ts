import type { View } from '../types';

export const navItems: { id: View; label: string; glyph: string; path: string }[] = [
  { id: 'record', label: '티어기록', glyph: '◆', path: '/record' },
  { id: 'feedback', label: '피드백', glyph: '✦', path: '/feedback' },
  { id: 'group', label: '그룹찾기', glyph: '◫', path: '/group' },
  { id: 'community', label: '커뮤니티', glyph: '▤', path: '/community' },
  { id: 'profile', label: '내 정보', glyph: '●', path: '/profile' },
  { id: 'admin', label: '관리자', glyph: '⚑', path: '/admin' },
];

/** 알림처럼 View 값만 들고 있는 곳에서 경로로 변환할 때 쓴다. */
export const viewPaths: Record<View, string> = {
  record: '/record',
  feedback: '/feedback',
  group: '/group',
  community: '/community',
  profile: '/profile',
  admin: '/admin',
};