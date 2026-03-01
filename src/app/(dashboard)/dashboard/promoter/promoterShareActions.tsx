"use client";

// Component: PromoterShareActions
// Reference: component.gallery/components/button
// Inspired by: Atlassian Design System pattern
// NightTable usage: copy/share actions for promoter tracked booking link

import { useState } from "react";

import type { ReactElement } from "react";

type PromoterShareActionsProps = {
  /** Full tracked reservation link for the promoter. */
  link: string;
};

export default function PromoterShareActions({ link }: PromoterShareActionsProps): ReactElement {
  const [copied, setCopied] = useState<boolean>(false);
  const hasNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  async function onCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function onShare(): Promise<void> {
    if (!navigator.share) {
      return;
    }

    try {
      await navigator.share({
        title: "Mon lien NightTable",
        text: "Réserve avec mon lien NightTable",
        url: link,
      });
    } catch {
      // User cancelled share action.
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => {
          void onCopy();
        }}
        className="nt-btn nt-btn-secondary min-h-11 min-w-11 px-4 py-2 text-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
      >
        {copied ? "Copié" : "Copier"}
      </button>
      {hasNativeShare ? (
        <button
          type="button"
          onClick={() => {
            void onShare();
          }}
          className="nt-btn nt-btn-primary min-h-11 min-w-11 px-4 py-2 text-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
        >
          Partager
        </button>
      ) : null}
    </div>
  );
}
