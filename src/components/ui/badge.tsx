// Component: Badge
// Reference: component.gallery/components/badge
// Inspired by: Shopify Polaris, NightTable tokens
// NightTable usage: statuts Femmes VIP, tags, labels

import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  color?: "promo" | "influence" | "fidele" | "nouvelle" | "default";
  className?: string;
}

const colorMap = {
  promo: "bg-[--color-accent]/15 text-[--color-accent] border border-[--color-accent]/30",
  influence: "bg-[--color-danger]/15 text-[--color-danger] border border-[--color-danger]/30",
  fidele: "bg-[--color-success]/15 text-[--color-success] border border-[--color-success]/30",
  nouvelle: "bg-[--color-success]/15 text-[--color-success] border border-[--color-success]/30",
  default: "bg-[--color-muted]/15 text-[--color-muted] border border-[--color-muted]/30",
};

export function Badge({ children, color = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${colorMap[color] || colorMap.default} ${className}`}
    >
      {children}
    </span>
  );
}
