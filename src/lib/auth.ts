import { UserRole } from "@/types";

export function normalizeRole(value: string | null | undefined): UserRole {
  if (
    value === "client" ||
    value === "club" ||
    value === "promoter" ||
    value === "female_vip" ||
    value === "admin"
  ) {
    return value;
  }

  return "client";
}

export function getDashboardPathByRole(role: string | null | undefined): string {
  const normalizedRole = normalizeRole(role);

  switch (normalizedRole) {
    case "client":
      return "/dashboard/client";
    case "club":
      return "/dashboard/club";
    case "promoter":
      return "/dashboard/promoter";
    case "female_vip":
      return "/dashboard/vip";
    case "admin":
      return "/dashboard/admin";
    default:
      return "/dashboard/client";
  }
}

export function getAllowedDashboardPrefixes(role: string | null | undefined): string[] {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return ["/dashboard"];
  }

  return [getDashboardPathByRole(normalizedRole)];
}
