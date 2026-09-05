const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const DEFAULT_TIMEOUT_MS = 10_000;

/** 서버가 응답했지만 상태 코드가 실패인 경우. */
export class ApiError extends Error {
  status: number;
  url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
  }
}

/** 서버에 닿지 못했거나 시간이 초과된 경우. */
export class NetworkError extends Error {
  url: string;

  constructor(message: string, url: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'NetworkError';
    this.url = url;
  }
}

type RequestOptions = RequestInit & { timeoutMs?: number };

/** 앱 API 호출. 경로는 '/records'처럼 baseURL 기준 상대 경로로 넘긴다. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...rest } = options;
  const url = `${BASE_URL}${path}`;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...headers },
    });

    if (!response.ok) {
      throw new ApiError(`요청이 실패했습니다. (${response.status})`, response.status, url);
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new NetworkError('요청 시간이 초과됐습니다.', url, { cause: error });
    }
    throw new NetworkError('서버에 연결하지 못했습니다.', url, { cause: error });
  } finally {
    window.clearTimeout(timer);
  }
}

/** public/ 아래 정적 JSON 로딩용. baseURL을 붙이지 않는다. */
export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(`파일을 불러오지 못했습니다. (${response.status})`, response.status, url);
  }
  return response.json() as Promise<T>;
}