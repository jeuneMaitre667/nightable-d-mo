/**
 * Calculates a dynamic price for a table reservation.
 * @param basePrice - The base price of the table in euros
 * @param occupancyRate - Current occupancy (0 to 1). Coefficient ranges from 1.0 to 2.0
 * @param daysUntilEvent - Days until the event. Early bird discount → same-day premium
 * @param eventNotoriety - Event fame multiplier (1.0 to 2.5)
 * @returns The dynamic price rounded to the nearest 25€
 */
export function calculateDynamicPrice(
  basePrice: number,
  occupancyRate: number,
  daysUntilEvent: number,
  eventNotoriety: number
): number {
  // Occupancy coefficient: 1.0 at 0%, 2.0 at 100%
  const occupancyCoefficient = 1.0 + occupancyRate

  // Days until event coefficient:
  // 30+ days: 0.85 (early bird)
  // 14-29 days: 0.95
  // 7-13 days: 1.0
  // 3-6 days: 1.1
  // 1-2 days: 1.3
  // same day (0): 1.5
  let daysCoefficient: number
  if (daysUntilEvent >= 30) {
    daysCoefficient = 0.85
  } else if (daysUntilEvent >= 14) {
    daysCoefficient = 0.95
  } else if (daysUntilEvent >= 7) {
    daysCoefficient = 1.0
  } else if (daysUntilEvent >= 3) {
    daysCoefficient = 1.1
  } else if (daysUntilEvent >= 1) {
    daysCoefficient = 1.3
  } else {
    daysCoefficient = 1.5
  }

  // Clamp eventNotoriety between 1.0 and 2.5
  const notoriety = Math.max(1.0, Math.min(2.5, eventNotoriety))

  const rawPrice = basePrice * occupancyCoefficient * daysCoefficient * notoriety

  // Round to nearest 25€
  return Math.round(rawPrice / 25) * 25
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
