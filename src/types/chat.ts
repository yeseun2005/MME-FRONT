export type ChatRoomType = 'feedback' | 'party';

export type Message = {
  id: number;
  roomId: string;
  senderId: string;
  senderNickname: string;
  body: string;
  status: 'sent' | 'failed';
  sentAt: string;
};

export type ChatRoom = {
  id: string;
  type: ChatRoomType;
  refId: string; // 피드백 요청 ID 또는 파티 ID
  title: string;
  participantIds: string[];
  lastMessageAt?: string;
};