export function money(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}