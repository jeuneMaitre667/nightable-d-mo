import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PricingParams {
  basePrice: number;
  occupancyRate: number;
  daysUntilEvent: number;
  eventNotoriety: number;
}

export function calculateDynamicPrice({
  basePrice,
  occupancyRate,
  daysUntilEvent,
  eventNotoriety,
}: PricingParams): number {
  const occupancyCoeff =
    occupancyRate < 0.5 ? 1.0 :
    occupancyRate < 0.7 ? 1.15 :
    occupancyRate < 0.85 ? 1.35 :
    occupancyRate < 0.95 ? 1.65 : 2.0;

  const timeCoeff =
    daysUntilEvent > 14 ? 0.85 :
    daysUntilEvent > 7 ? 1.0 :
    daysUntilEvent > 3 ? 1.15 :
    daysUntilEvent > 1 ? 1.35 : 1.5;

  const finalPrice = basePrice * occupancyCoeff * timeCoeff * eventNotoriety;
  return Math.ceil(finalPrice / 25) * 25;
}
