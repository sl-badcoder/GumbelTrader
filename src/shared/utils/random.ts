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
