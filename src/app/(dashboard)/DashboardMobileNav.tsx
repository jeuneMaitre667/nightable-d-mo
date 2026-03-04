"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  href: string;
  label: string;
  icon?: string;
  badge?: string;
};

type DashboardMobileNavProps = {
  menuItems: MenuItem[];
};

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard/club") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardMobileNav({ menuItems }: DashboardMobileNavProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#C9973A]/10 bg-[#0A0F2E]/95 px-2 py-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] backdrop-blur md:hidden">
      <div className="grid grid-cols-5 gap-2">
        {menuItems.map((item) => {
          const active = isItemActive(pathname, item.href);

          return (
            <Link
              key={`mobile-${item.label}-${item.href}`}
              href={item.href}
              className={`flex min-h-11 flex-col items-center justify-center rounded-lg border px-1 py-1 text-center transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111318] ${
                active
                  ? "border-[#C9973A]/50 bg-[#C9973A]/15 text-[#C9973A]"
                  : "border-white/10 bg-[#0A0F2E]/35 text-[#888888] hover:border-[#C9973A]/30 hover:text-[#F7F6F3]"
              }`}
            >
              <span className="text-[11px] leading-none">{item.icon ?? "•"}</span>
              <span className="mt-1 text-[10px] leading-none">{item.label}</span>
              {item.badge ? <span className="sr-only">Alerte active</span> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
