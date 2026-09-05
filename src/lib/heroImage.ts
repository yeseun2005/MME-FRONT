import type { Hero } from '../types';

export function heroImagePath(slug: string) {
  return `/images/heroes/${slug}.png`;
}

export function heroSlug(heroes: Hero[], name: string) {
  return heroes.find((hero) => hero.name === name)?.slug;
}