# MMe Frontend

오버워치 플레이를 기록하고 성장으로 연결하는 서비스, MMe의 프론트엔드입니다.

**배포** · <https://mme-front.vercel.app/record>

---

## 현재 상태

`2026-09-06` 기준

| 영역 | 상태 |
| --- | --- |
| 기획 | 화면 흐름도 22개 완성 |
| 프론트엔드 | 화면 구현 완료, 배포 중 |
| 백엔드 | **미착수** — 기술 스택 미정 |
| 데이터 | 브라우저 localStorage + 정적 JSON |

기획 문서 기준 Stage 1(프론트엔드 체험판)에 해당합니다. 서버 없이 브라우저에 저장하며 전체 화면 흐름을 확인할 수 있는 단계입니다.

---

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 프레임워크 | React 19 |
| 언어 | TypeScript |
| 빌드 | Vite 8 |
| 스타일 | Tailwind CSS v4 |
| 라우팅 | React Router v7 |
| 배포 | Vercel |

상태 관리 라이브러리는 사용하지 않습니다. React Router의 `Outlet context`로 전역 상태를 전달합니다.

---

## 실행

```bash
npm install
npm run fetch:heroes   # 영웅 이미지 자산 다운로드 (최초 1회)
npm run dev
```

`fetch:heroes`를 실행하지 않으면 영웅 이미지가 이니셜 박스로 표시됩니다. 레이아웃은 정상 동작합니다.

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입 체크 + 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint |
| `npm run fetch:heroes` | 영웅 이미지 자산 다운로드 |

---

## 폴더 구조

```
src/
├── app/            Outlet context 타입 정의, useApp() 훅
├── layouts/        AppLayout — 인증 게이트, 공통 레이아웃, 전역 상태
├── pages/          라우트별 페이지 (7개)
├── features/       도메인별 화면
│   ├── record/       티어기록, 메타 인사이트
│   ├── feedback/     피드백 제공자, 인증
│   ├── group/        그룹찾기, 파티
│   ├── community/    커뮤니티
│   ├── profile/      내 정보
│   ├── admin/        관리자 검수
│   └── auth/         로그인, 온보딩
├── components/
│   ├── ui/           공용 컴포넌트 (Button, Modal, Select 등)
│   └── layout/       Header, SideNav, BottomNav
├── hooks/          상태·저장 로직
├── lib/            api, date, file, heroImage 등 유틸
├── types/          도메인 타입 정의
└── constants/      내비게이션, 목업 데이터
```

화면 전용 상태는 각 페이지가, 화면을 이동해도 유지되어야 하는 상태는 `AppLayout`이 관리합니다.

---

## 라우팅

| 경로 | 화면 |
| --- | --- |
| `/record` | 티어기록 — 캘린더, K/A/D 기록 |
| `/record/meta` | 메타 인사이트 — 영웅 통계 |
| `/feedback` | 피드백 제공자 목록, 제공자 인증 |
| `/group` | 그룹찾기 — 랜덤팟, 선택팟 |
| `/community` | 커뮤니티 게시판 |
| `/profile` | 내 정보 |
| `/admin` | 관리자 검수 |

`/` 및 매칭되지 않는 경로는 `/record`로 리다이렉트됩니다.

---

## 데이터

현재 서버가 없어 브라우저와 정적 파일에 의존합니다.

| 저장 위치 | 내용 | 지속성 |
| --- | --- | --- |
| localStorage | 로그인 상태, 프로필, 게임 기록, 인증 신청, 테마 | 브라우저에 유지 |
| `public/data/*.json` | 영웅 53종, 경쟁전 통계 (모드·역할·등급·전장·지역별) | 정적 |
| 메모리 | 파티, 게시글, 알림 | 새로고침 시 초기화 |

---

## 서버 연동 시 변경 지점

- **`lib/api.ts`** — baseURL, 타임아웃, `ApiError`/`NetworkError` 정의가 준비되어 있습니다. 아직 호출하는 곳은 없습니다.
- **`hooks/`** — `useGameRecords`, `useProviderApplications` 등이 저장 로직을 내부에 캡슐화하고 있습니다. 훅 내부만 교체하면 컴포넌트 수정 없이 서버 연동이 가능합니다.
- **`types/`** — 도메인 타입이 정의되어 있어 API 응답 형태를 협의할 때 출발점으로 사용할 수 있습니다.
- **`.env`** — `VITE_API_BASE_URL` 하나만 설정하면 됩니다. `.env.example` 참고.

---

## 아직 정하지 않은 것

백엔드는 결정된 사항이 없습니다. 아래 항목을 함께 정할 예정입니다.

- **데이터베이스** — 게임 기록 조회가 사용자·날짜·모드 조합 기준입니다
- **인증 방식** — Google, 카카오, 넥슨 소셜 로그인이 필요합니다
- **파일 저장** — 하이라이트 영상, 제공자 인증 증빙
- **API 응답·에러 규약**
- **서버 배포 환경**

---

## 프로젝트

- 기간 · 2026.09.07 – 2027.01.31
- 구성 · 기획 1명, 프론트엔드 1명
