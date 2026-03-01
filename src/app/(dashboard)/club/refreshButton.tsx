"use client";

import { useRouter } from "next/navigation";

export default function RefreshButton(): JSX.Element {
  const router = useRouter();

  return (
    <button type="button" className="nt-btn nt-btn-secondary px-4 py-2" onClick={() => router.refresh()}>
      Rafraîchir
    </button>
  );
}
