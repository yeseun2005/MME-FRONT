import type { Hero } from '../types';

export function money(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function heroImage(heroes: Hero[], name: string) {
  return heroes.find((hero) => hero.name === name)?.thumbnailUrl;
}

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  return response.json() as Promise<T>;
}