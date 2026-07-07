export type Fraction = {
  numerator: number;
  denominator: number;
};

export function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);

  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }

  return a || 1;
}

export function simplifyFraction(fraction: Fraction): Fraction {
  const sign = fraction.denominator < 0 ? -1 : 1;
  const divisor = gcd(fraction.numerator, fraction.denominator);

  return {
    numerator: (fraction.numerator / divisor) * sign,
    denominator: Math.abs(fraction.denominator / divisor)
  };
}

export function formatFraction(fraction: Fraction): string {
  const simplified = simplifyFraction(fraction);

  if (simplified.denominator === 1) {
    return String(simplified.numerator);
  }

  return `${simplified.numerator}/${simplified.denominator}`;
}

export function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return String(Number(value.toFixed(8)));
}

export function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}

export function parseFractionAnswer(value: string): Fraction | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);

  if (!match) {
    return null;
  }

  const numerator = Number(match[1]);
  const denominator = Number(match[2]);

  if (denominator === 0) {
    return null;
  }

  return simplifyFraction({ numerator, denominator });
}
