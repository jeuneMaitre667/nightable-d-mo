// Component: LoginPage
// Reference: component.gallery/components/tabs
// Inspired by: Velvet Rope split-auth pattern
// NightTable usage: login route rendering shared auth split-screen page


import Link from "next/link";
import { AuthSplitPage } from "@/app/(auth)/AuthSplitPage";

import type { ReactElement } from "react";

export default function LoginPage(): ReactElement {
  return (
    <>
      <header className="absolute left-0 right-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" aria-label="Accueil NightTable" className="flex items-center gap-2">
            <span className="text-2xl font-cormorant font-bold tracking-widest text-[#C9973A] uppercase">NightTable</span>
          </Link>
        </div>
      </header>
      <AuthSplitPage initialTab="login" />
    </>
  );
}
