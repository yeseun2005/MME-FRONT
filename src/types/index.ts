export type View = 'record' | 'feedback' | 'group' | 'community' | 'profile' | 'admin';

export type Hero = {
  id: string;
  name: string;
  slug: string;
  role: 'tank' | 'damage' | 'support';
  subrole: string;
  thumbnailUrl: string;
};

export type RecordMode = '빠른 대전' | '경쟁전';

export type GameRecord = {
  date: string;
  mode: RecordMode;
  kills: number;
  assists: number;
  deaths: number;
  tier: string;
  position: string;
  hero: string;
  memo: string;
  videoName?: string;
  videoUrl?: string;
};

export type RecordDraft = {
  kills: number;
  assists: number;
  deaths: number;
  tier: string;
  position: string;
  hero: string;
  memo: string;
  videoName: string;
  videoUrl: string;
  videoFile: File | null;
};

export type Profile = {
  nickname: string;
  tier: string;
  position: string;
  heroes: string[];
  nexon: boolean;
  notificationsEnabled: boolean;
  providerStatus: 'none' | 'review' | 'approved' | 'rejected';
  providerType?: '상위 500위' | '프로게이머';
  providerRejectReason?: string;
};

export type Coach = {
  id: number;
  nickname: string;
  tier: string;
  position: string;
  heroes: string[];
  price: number;
  rating: number;
  reviews: number;
  bio: string;
  verified: boolean;
  credential: 'TOP 500' | 'PRO';
  image: string;
};

export type Party = {
  id: number;
  title: string;
  mode: string;
  tier: string;
  current: number;
  total: number;
  positions: string[];
  voice: boolean;
};

export type Comment = {
  id: number;
  author: string;
  body: string;
  time: string;
};

export type Post = {
  id: number;
  category: string;
  title: string;
  author: string;
  time: string;
  likes: number;
  comments: Comment[];
  hero?: string;
  body: string;
};

export type HeroStat = {
  heroId: string;
  name: string;
  role: string;
  subrole: string;
  thumbnailUrl: string;
  pickRate: number;
  winRate: number;
  banRate: number;
};

export type StatGroup = { label: string; heroes: HeroStat[] };

export type MetaData = {
  fetchedAt: string;
  overall: HeroStat[];
  ranks: Record<string, StatGroup>;
  roles: Record<string, StatGroup>;
  maps: Record<string, StatGroup>;
  regions: Record<string, StatGroup>;
};

export type MetaScope = 'overall' | 'rank' | 'role' | 'map' | 'region';
export type MetricKey = 'pickRate' | 'winRate' | 'banRate';
export type BackendStatus = 'connecting' | 'online' | 'offline' | 'syncing';
export type SaveNotice = { id: number; title: string; detail: string };