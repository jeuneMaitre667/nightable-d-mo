'use client';

// Component: ClubSlugPageClient
// Reference: component.gallery/components/card
// Inspired by: Soho House establishment page pattern
// NightTable usage: public club showcase page

import Image from 'next/image';
import Link from 'next/link';

import { Button, Chip } from '@heroui/react';

type ProgramItem = {
  title: string;
  time: string;
  price: string;
  href: string;
  dateLabel: string;
};

type ClubSlugPageClientProps = {
  clubName: string;
  clubCity: string;
  clubHeroImage: string;
  clubVibes: string[];
  minPriceLabel: string;
  programItems: ProgramItem[];
  ambiancePhotos: string[];
};

function formatDateBlock(dateLabel: string): { dayName: string; dayNumber: string; monthName: string } {
  const date = new Date(`${dateLabel}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return {
      dayName: 'SAM',
      dayNumber: '--',
      monthName: 'MARS',
    };
  }

  return {
    dayName: new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date).replace('.', '').toUpperCase(),
    dayNumber: new Intl.DateTimeFormat('fr-FR', { day: '2-digit' }).format(date),
    monthName: new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date).toUpperCase(),
  };
}

export default function ClubSlugPageClient({
  clubName,
  clubCity,
  clubHeroImage,
  clubVibes,
  minPriceLabel,
  programItems,
  ambiancePhotos,
}: ClubSlugPageClientProps): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#050508] pb-24 text-[#F7F6F3] md:pb-0">
      <section className="relative h-[65vh] min-h-[420px] overflow-hidden">
        <Image
          src={clubHeroImage}
          alt={`Photo de couverture du club ${clubName}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_30%,#050508_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,8,0.2)_0%,transparent_60%)]" />

        <div className="absolute bottom-8 left-0 right-0 z-10 mx-auto max-w-7xl px-6">
          <p className="text-sm text-[#F7F6F3]/70">{clubCity}</p>
          <h1 className="nt-heading mt-2 text-[40px] font-light leading-none md:text-[56px]">{clubName}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {clubVibes.map((vibe) => (
              <Chip key={`${clubName}-${vibe}`} size="sm" variant="flat" className="bg-[#12172B]/80 text-[#F7F6F3]">
                {vibe}
              </Chip>
            ))}
            <span className="ml-1 text-lg font-medium text-[#C9973A]">À partir de {minPriceLabel}</span>
          </div>
        </div>
      </section>

      <section id="club-events" className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-3">
          <h2 className="text-[18px] font-semibold text-[#F7F6F3]">Programmation</h2>
          <p className="mt-1 text-[13px] text-[#888888]">Les prochaines soirées disponibles à la réservation</p>
        </header>

        <div>
          {programItems.map((eventItem) => {
            const dateBlock = formatDateBlock(eventItem.dateLabel);

            return (
              <article key={`${eventItem.title}-${eventItem.dateLabel}`} className="flex items-center justify-between gap-4 border-b border-white/5 py-5">
                <div className="w-[60px] shrink-0 text-center">
                  <p className="nt-heading text-[14px] uppercase text-[#888888]">{dateBlock.dayName}</p>
                  <p className="nt-heading text-[24px] leading-none text-[#F7F6F3]">{dateBlock.dayNumber}</p>
                  <p className="nt-heading text-[14px] uppercase text-[#888888]">{dateBlock.monthName}</p>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-[#F7F6F3]">{eventItem.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Chip size="sm" variant="flat" color="primary">
                      Line-up à venir
                    </Chip>
                    <span className="text-xs text-[#888888]">{eventItem.time}</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-sm text-[#C9973A]">Dès {eventItem.price}</span>
                  <Button as={Link} href={eventItem.href} size="sm" variant="bordered" color="primary" radius="none" className="min-h-9">
                    Réserver
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {ambiancePhotos.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-10 md:pb-14">
          <h3 className="mb-4 text-[18px] font-semibold text-[#F7F6F3]">Ambiance</h3>
          <div className="grid gap-4 md:grid-cols-[3fr_2fr]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src={ambiancePhotos[0]}
                alt={`Ambiance principale du club ${clubName}`}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw, 60vw"
              />
            </div>
            <div className="grid gap-4">
              {ambiancePhotos.slice(1, 3).map((photo, index) => (
                <div key={`${photo}-${index}`} className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <Image
                    src={photo}
                    alt={`Ambiance secondaire ${index + 1} du club ${clubName}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 100vw, 40vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-[#050508]/95 p-4 backdrop-blur md:hidden">
        <Button as={Link} href="#club-events" color="primary" radius="none" fullWidth className="h-12 min-h-12">
          Voir les événements
        </Button>
      </div>
    </main>
  );
}