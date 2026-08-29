import { useState } from 'react';
import type { AppNotification, NotificationType } from '../types/notification';

export function useNotifications(enabled: boolean = true) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  function push(type: NotificationType, title: string, body: string, targetView: AppNotification['targetView']) {
    if (!enabled) return;
    // 동일 사건 중복 알림 방지: 같은 title이 이미 미확인 상태면 새로 만들지 않음
    setNotifications((current) => {
      const duplicate = current.some((item) => item.title === title && !item.read);
      if (duplicate) return current;
      return [
        { id: Date.now(), type, title, body, targetView, read: false, createdAt: '방금 전' },
        ...current,
      ];
    });
  }

  function markRead(id: number) {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }

  function markAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }

  return { notifications, unreadCount, push, markRead, markAllRead };
}