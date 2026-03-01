"use client";

import { useRouter } from "next/navigation";

import type { ReactElement } from "react";

export default function RefreshButton(): ReactElement {
  const router = useRouter();

  return (
    <button type="button" className="nt-btn nt-btn-secondary px-4 py-2" onClick={() => router.refresh()}>
      Rafraîchir
    </button>
  );
}
