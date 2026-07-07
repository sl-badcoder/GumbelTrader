export type RandomNumberGenerator = () => number;

export const defaultRandom: RandomNumberGenerator = Math.random;

export function randomIntInclusive(
  min: number,
  max: number,
  random: RandomNumberGenerator = defaultRandom
): number {
  const safeMin = Math.ceil(Math.min(min, max));
  const safeMax = Math.floor(Math.max(min, max));
  return Math.floor(random() * (safeMax - safeMin + 1)) + safeMin;
}

export function createSeededRandom(seed: number): RandomNumberGenerator {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

export function mixSeed(seed: number, value: number): number {
  let mixed = (seed ^ value) >>> 0;
  mixed = Math.imul(mixed ^ (mixed >>> 16), 2246822507) >>> 0;
  mixed = Math.imul(mixed ^ (mixed >>> 13), 3266489909) >>> 0;
  return (mixed ^ (mixed >>> 16)) >>> 0;
}
