export const MONTH_LABELS_EN = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
] as const;

/** month */
export function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

/** 해당 월 1일의 요일. 0=일요일 */
export function firstWeekday(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

export function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function shiftMonth(year: number, month: number, delta: number) {
  const shifted = new Date(year, month - 1 + delta, 1);
  return { year: shifted.getFullYear(), month: shifted.getMonth() + 1 };
}

/** 31일 선택 상태에서 2월로 이동할 때 28/29일로 당겨줌 */
export function clampDay(year: number, month: number, day: number) {
  return Math.min(Math.max(day, 1), daysInMonth(year, month));
}

/** 달력 그리드 셀 */
export function buildCalendarCells(year: number, month: number) {
  const lead = firstWeekday(year, month);
  const total = daysInMonth(year, month);
  const cells = Math.ceil((lead + total) / 7) * 7;
  return Array.from({ length: cells }, (_, index) => index - lead + 1);
}

export function isSameDate(year: number, month: number, day: number, other: Date) {
  return other.getFullYear() === year && other.getMonth() + 1 === month && other.getDate() === day;
}