import type { Coach, Party, Post } from '../types';

export const coaches: Coach[] = [
  { id: 1, nickname: 'AimArchive', tier: '챔피언 4', position: '공격', heroes: ['애쉬', '캐서디'], price: 24000, rating: 4.9, reviews: 128, bio: '에임 루틴부터 교전 각도까지, 다시 볼 수 있는 타임라인 피드백을 드립니다.', verified: true, credential: 'TOP 500', image: 'https://sht-vod.dn.nexoncdn.co.kr/shpd-game/Hero/OW/4076bbaa2eb52a0bfe612434071e56e7702d5454473dbbea2f9e392a9d997a94.png' },
  { id: 2, nickname: 'MEKAcoach', tier: '그랜드마스터 1', position: '돌격', heroes: ['D.Va', '윈스턴'], price: 29000, rating: 4.8, reviews: 86, bio: '공간 설계와 진입 타이밍을 중심으로 팀을 이끄는 탱커 플레이를 함께 봅니다.', verified: true, credential: 'PRO', image: 'https://sht-vod.dn.nexoncdn.co.kr/shpd-game/Hero/OW/df5a5532862d9292634fb3dc0e51a4705aa601de65e5e815513ccc663d84de56.png' },
  { id: 3, nickname: 'PulseHeal', tier: '챔피언 5', position: '지원', heroes: ['아나', '주노'], price: 21000, rating: 4.7, reviews: 54, bio: '힐 우선순위와 생존 동선을 짚어 드려 다음 게임에 바로 적용할 수 있게 합니다.', verified: true, credential: 'TOP 500', image: 'https://sht-vod.dn.nexoncdn.co.kr/shpd-game/Hero/OW/985b06beae46b7ba3ca87d1512d0fc62ca7f206ceca58ef16fc44d43a1cc84ed.png' },
];

export const initialParties: Party[] = [
  { id: 1, title: '퇴근 후 경쟁전, 분위기 좋게 가요', mode: '경쟁전', tier: '플래티넘 1–다이아 4', current: 3, total: 5, positions: ['돌격', '지원'], voice: true },
  { id: 2, title: '스타디움 첫 판부터 같이 하실 분', mode: '스타디움', tier: '티어 무관', current: 2, total: 4, positions: ['자유 역할'], voice: false },
  { id: 3, title: '빠대 일퀘, 초보 환영', mode: '빠른 대전', tier: '티어 무관', current: 4, total: 5, positions: ['공격'], voice: true },
];

export const initialPosts: Post[] = [
  {
    id: 1,
    category: '경쟁용',
    title: '이번 시즌 지원가 배치, 첫 교전에서 이것만 봐도 달라져요',
    author: 'PulseHeal',
    time: '12분 전',
    likes: 32,
    hero: '아나',
    body: '첫 교전에서는 아군의 이동기와 상대 다이브 조합을 먼저 확인해 보세요.',
    comments: [
      { id: 1, author: 'MekaPilot', body: '오 이거 진짜 도움 되네요', time: '10분 전' },
      { id: 2, author: 'BunnyHop', body: '아나 힐밴 타이밍도 같이 정리해주실 수 있나요?', time: '8분 전' },
      { id: 3, author: 'ArenaDesk', body: '저장했습니다 감사해요', time: '3분 전' },
    ],
  },
  {
    id: 2,
    category: '빠대용',
    title: '오늘 저녁 신규 영웅 연습팟 같이 하실 분?',
    author: 'MekaPilot',
    time: '28분 전',
    likes: 18,
    hero: 'D.Mon',
    body: '실수해도 웃으면서 할 분들 환영합니다. 9시 시작 예정이에요.',
    comments: [
      { id: 1, author: 'PulseHeal', body: '저요! 참가할게요', time: '20분 전' },
    ],
  },
  {
    id: 3,
    category: '스타디움용',
    title: 'D.Va 스타디움 파워 선택 정리',
    author: 'BunnyHop',
    time: '1시간 전',
    likes: 47,
    hero: 'D.Va',
    body: '상대 조합에 따라 방어 매트릭스 중심과 부스터 중심으로 나눠 봤습니다.',
    comments: [
      { id: 1, author: 'AimArchive', body: '부스터 중심 조합 저도 써봐야겠네요', time: '40분 전' },
      { id: 2, author: 'Workshop', body: '방어 매트릭스는 언제 찍는 게 좋을까요', time: '30분 전' },
    ],
  },
  {
    id: 4,
    category: '사설방용',
    title: '주말 내전 2자리 모집합니다',
    author: 'Workshop',
    time: '2시간 전',
    likes: 12,
    body: '다이아 이하, 역할 고정 없이 매 판 섞어서 진행합니다.',
    comments: [],
  },
  {
    id: 5,
    category: 'OWCS용',
    title: '부산 결승전 밴픽 포인트 세 장면',
    author: 'ArenaDesk',
    time: '3시간 전',
    likes: 56,
    hero: '트레이서',
    body: '두 번째 전장에서 공격 템포가 갈린 이유를 영웅 교체 타이밍으로 정리했습니다.',
    comments: [
      { id: 1, author: 'PulseHeal', body: '결승전 다시보기 링크도 있나요?', time: '2시간 전' },
    ],
  },
];