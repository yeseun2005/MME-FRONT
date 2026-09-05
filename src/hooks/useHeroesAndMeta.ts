import { useEffect, useState } from 'react';
import type { Hero, HeroStat, MetaData, StatGroup } from '../types';
import { fetchJson } from '../lib/api';

const emptyMeta: MetaData = { fetchedAt: '', overall: [], ranks: {}, roles: {}, maps: {}, regions: {} };

export function useHeroesAndMeta() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [metaData, setMetaData] = useState<MetaData>(emptyMeta);

  useEffect(() => {
    fetchJson<{ data?: Hero[] }>('/data/heroes.json')
      .then((payload) => setHeroes(payload.data || []))
      .catch(() => setHeroes([]));

    Promise.all([
      fetchJson<{ fetchedAt: string; heroes?: HeroStat[] }>('/data/competitive-overall.json'),
      fetchJson<{ ranks?: Record<string, StatGroup> }>('/data/competitive-by-rank.json'),
      fetchJson<{ roles?: Record<string, StatGroup> }>('/data/competitive-by-role.json'),
      fetchJson<{ maps?: Record<string, StatGroup> }>('/data/competitive-by-map.json'),
      fetchJson<{ regions?: Record<string, StatGroup> }>('/data/competitive-by-region.json'),
    ])
      .then(([overall, rank, role, map, region]) =>
        setMetaData({
          fetchedAt: overall.fetchedAt,
          overall: overall.heroes || [],
          ranks: rank.ranks || {},
          roles: role.roles || {},
          maps: map.maps || {},
          regions: region.regions || {},
        }),
      )
      .catch(() => undefined);
  }, []);

  return { heroes, metaData };
}