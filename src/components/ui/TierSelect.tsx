import { Select } from './Select';
import { tierNames, tierDivisions, splitTier, joinTier } from '../../constants/tiers';

export function TierSelect({ value, onChange }: { value: string; onChange: (tier: string) => void }) {
  const { name, division } = splitTier(value);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Select value={name} onChange={(event) => onChange(joinTier(event.target.value, division))}>
        {tierNames.map((tierName) => (
          <option key={tierName}>{tierName}</option>
        ))}
      </Select>
      <Select value={String(division)} onChange={(event) => onChange(joinTier(name, Number(event.target.value)))}>
        {tierDivisions.map((div) => (
          <option key={div} value={div}>
            {div}
          </option>
        ))}
      </Select>
    </div>
  );
}