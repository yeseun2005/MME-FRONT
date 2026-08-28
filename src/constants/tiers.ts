export const tierNames = ['브론즈', '실버', '골드', '플래티넘', '에메랄드', '다이아몬드', '마스터', '그랜드마스터', '챔피언'];
export const tierDivisions = [5, 4, 3, 2, 1];
export const tierOptions = tierNames.flatMap((tier) => tierDivisions.map((division) => `${tier} ${division}`));

export function splitTier(tier: string): { name: string; division: number } {
  const [name, divisionRaw] = tier.split(' ');
  const division = Number(divisionRaw) || 5;
  return tierNames.includes(name) ? { name, division } : { name: '브론즈', division: 5 };
}

export function joinTier(name: string, division: number) {
  return `${name} ${division}`;
}