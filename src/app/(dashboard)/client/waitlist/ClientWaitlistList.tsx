'use client';

// Component: ClientWaitlistList
// Reference: component.gallery/components/list
// Inspired by: Atlassian list row pattern
// NightTable usage: client waitlist management

import Link from "next/link";
import { Button, Card, CardBody } from "@heroui/react";

type WaitlistItem = {
  id: string;
  title: string;
  clubName: string;
  dateLabel: string;
  position: number;
};

type ClientWaitlistListProps = {
  entries: WaitlistItem[];
  leaveWaitlistFormAction: (formData: FormData) => Promise<void>;
};

export function ClientWaitlistList({
  entries,
  leaveWaitlistFormAction,
}: ClientWaitlistListProps): React.JSX.Element {
  if (entries.length === 0) {
    return (
      <Card className="border border-[#C9973A]/15 bg-[#12172B] shadow-none">
        <CardBody className="p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-[#C9973A]/30 bg-[#C9973A]/10" />
          <h2 className="text-lg font-semibold text-[#F7F6F3]">Aucune waitlist active</h2>
          <p className="mt-2 text-sm text-[#888888]">
            Explorez les événements et rejoignez une waitlist pour augmenter vos chances.
          </p>
          <Button
            as={Link}
            href="/clubs"
            className="mt-5 min-h-11 bg-[#C9973A] px-4 text-sm font-semibold text-[#050508]"
          >
            Voir les événements
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <Card key={entry.id} className="border border-[#C9973A]/10 bg-[#12172B] shadow-none">
          <CardBody className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-medium text-[#F7F6F3]">
                {entry.title} — {entry.clubName}
              </p>
              <p className="text-sm text-[#888888]">{entry.dateLabel}</p>
              <p className="text-xs uppercase tracking-wider text-[#C9973A]">Position #{entry.position}</p>
            </div>

            <form action={leaveWaitlistFormAction}>
              <input type="hidden" name="waitlist_id" value={entry.id} />
              <Button
                type="submit"
                variant="bordered"
                className="min-h-11 border-[#C4567A]/40 px-3 text-xs font-semibold text-[#C4567A]"
              >
                Quitter
              </Button>
            </form>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}