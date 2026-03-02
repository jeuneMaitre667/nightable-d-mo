"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { UserRole } from "@/types";

type MenuItem = {
  href: string;
  label: string;
  icon?: string;
  section?: "general" | "gestion";
  badge?: string;
};

type DashboardSidebarNavProps = {
  role: UserRole;
  menuItems: MenuItem[];
};

function itemClassName(isActive: boolean, href: string): string {
  if (isActive) {
    if (href === "/dashboard/club/clients") {
      return "flex min-h-11 items-center gap-2 rounded-lg bg-[#7D5DF6] px-3 py-2 text-[13px] font-medium text-white";
    }

    return "flex min-h-11 items-center gap-2 rounded-lg bg-[#C9973A] px-3 py-2 text-[13px] font-medium text-[#050508]";
  }

  return "flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-[#888888] transition-all duration-150 hover:bg-white/5 hover:text-[#F7F6F3]";
}

export function DashboardSidebarNav({ role, menuItems }: DashboardSidebarNavProps): React.JSX.Element {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/dashboard/club") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (role === "club") {
    const generalItems = menuItems.filter((item) => item.section === "general");
    const gestionItems = menuItems.filter((item) => item.section === "gestion");

    return (
      <>
        <p className="mb-1 px-3 text-[10px] uppercase tracking-widest text-[#555555]">GÉNÉRAL</p>
        <nav className="space-y-1">
          {generalItems.map((item) => (
            <Link key={`club-general-${item.label}-${item.href}`} href={item.href} className={itemClassName(isActive(item.href), item.href)}>
              <span className="inline-flex h-4 w-4 items-center justify-center text-[13px]">{item.icon ?? "•"}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <p className="mb-1 mt-5 px-3 text-[10px] uppercase tracking-widest text-[#555555]">GESTION</p>
        <nav className="space-y-1">
          {gestionItems.map((item) => (
            <Link key={`club-gestion-${item.label}-${item.href}`} href={item.href} className={itemClassName(isActive(item.href), item.href)}>
              <span className="inline-flex h-4 w-4 items-center justify-center text-[13px]">{item.icon ?? "•"}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </>
    );
  }

  return (
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <Link key={`${role}-${item.label}-${item.href}`} href={item.href} className={itemClassName(isActive(item.href), item.href)}>
          <span className="inline-flex h-4 w-4 items-center justify-center text-[13px]">{item.icon ?? "•"}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
