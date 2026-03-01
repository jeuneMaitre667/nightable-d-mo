// Component: DashboardLayout
// Reference: component.gallery/components/divider
// Inspired by: Shopify Polaris pattern
// NightTable usage: nested dashboard route wrapper

import type { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps): ReactNode {
  return children;
}
