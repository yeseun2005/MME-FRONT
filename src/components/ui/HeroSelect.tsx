import { useMemo, useState } from 'react';
import { Select } from './Select';
import type { Hero } from '../../types';

const roleLabels: Record<Hero['role'], string> = {
  tank: '돌격',
  damage: '공격',
  support: '지원',
};

export function HeroSelect({
  heroes,
  value,
  onChange,
}: {
  heroes: Hero[];
  value: string;
  onChange: (heroName: string) => void;
}) {
  const currentHero = heroes.find((hero) => hero.name === value);
  const [role, setRole] = useState<Hero['role']>(currentHero?.role ?? 'tank');

  const filteredHeroes = useMemo(() => heroes.filter((hero) => hero.role === role), [heroes, role]);

  function handleRoleChange(nextRole: Hero['role']) {
    setRole(nextRole);
    const firstOfRole = heroes.find((hero) => hero.role === nextRole);
    if (firstOfRole) onChange(firstOfRole.name);
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Select value={role} onChange={(event) => handleRoleChange(event.target.value as Hero['role'])}>
        {(['tank', 'damage', 'support'] as const).map((item) => (
          <option key={item} value={item}>
            {roleLabels[item]}
          </option>
        ))}
      </Select>
      <Select value={value} onChange={(event) => onChange(event.target.value)}>
        {filteredHeroes.map((hero) => (
          <option key={hero.id}>{hero.name}</option>
        ))}
      </Select>
    </div>
  );
}