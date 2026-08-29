export type PaymentStatus = '대기' | '성공' | '실패' | '취소' | '환불';
export type RequestStatus = '요청완료' | '진행중' | '피드백완료' | '취소' | '환불';
export type JobPostStatus = '게시' | '일시중지' | '삭제';

export type JobPost = {
  id: number;
  providerId: string;
  intro: string;
  tier: string;
  positions: string[];
  heroes: string[];
  method: string; // 예: '영상 리뷰', '1:1 코칭'
  price: number;
  status: JobPostStatus;
  rating: number;
  reviewCount: number;
};

export type FeedbackRequest = {
  id: number;
  buyerId: string;
  providerId: string;
  jobPostId: number;
  requestBody: string;
  targetRecordId?: string;
  amount: number;
  paymentStatus: PaymentStatus;
  requestStatus: RequestStatus;
  createdAt: string;
  completedAt?: string;
};

export type Review = {
  id: number;
  requestId: number;
  buyerId: string;
  providerId: string;
  rating: number; // 1~5
  body: string;
  createdAt: string;
};