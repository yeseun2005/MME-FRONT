export type NotificationType = '기록' | '피드백' | '채팅' | '매칭' | '검수결과';

export type AppNotification = {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  targetView: 'record' | 'feedback' | 'group' | 'community' | 'profile';
  read: boolean;
  createdAt: string;
};