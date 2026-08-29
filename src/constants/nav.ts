import type { View } from '../types';

export const navItems: { id: View; label: string; glyph: string }[] = [
  { id: 'record', label: '티어기록', glyph: '◆' },
  { id: 'feedback', label: '피드백', glyph: '✦' },
  { id: 'group', label: '그룹찾기', glyph: '◫' },
  { id: 'community', label: '커뮤니티', glyph: '▤' },
  { id: 'profile', label: '내 정보', glyph: '●' },
  { id: 'admin', label: '관리자', glyph: '⚑' },
];