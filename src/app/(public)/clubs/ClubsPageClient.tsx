'use client';

// Component: ClubsPageClient
// Reference: component.gallery/components/card
// Inspired by: Soho House image-first grid pattern
// NightTable usage: public discovery grid for partner clubs

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Button, Chip, Input } from '@heroui/react';

type ClubCard = {
  slug: string;
  name: string;
  area: string;
  vibe: string;
  minConsumption: string;
  image: string;
};

type ClubsPageClientProps = {
  clubs: ClubCard[];
};

export default function ClubsPageClient({ clubs }: ClubsPageClientProps): React.JSX.Element {
  const [query, setQuery] = useState<string>('');

  const filteredClubs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return clubs;
    }

    return clubs.filter((club) => {
      const tags = club.vibe.toLowerCase();

      return (
        club.name.toLowerCase().includes(normalizedQuery) ||
        club.area.toLowerCase().includes(normalizedQuery) ||
        tags.includes(normalizedQuery)
      );
    });
  }, [clubs, query]);

  return (
    <main className="min-h-screen bg-[#050508] px-4 py-10 text-[#F7F6F3] md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="space-y-5 text-center">
          <h1 className="nt-heading text-[36px] font-light leading-tight md:text-[48px]">Les clubs partenaires</h1>
          <p className="mx-auto max-w-2xl text-base text-[#888888]">
            Réservez votre table dans les meilleures adresses parisiennes
          </p>
          <div className="mx-auto max-w-[480px]">
            <Input
              value={query}
              onValueChange={setQuery}
              variant="bordered"
              placeholder="Rechercher un club..."
              startContent={<span className="text-[#888888]">⌕</span>}
              classNames={{
                inputWrapper: 'min-h-11 border-[#2A2F4A] bg-[#0A0F2E] px-3',
                input: 'text-[#F7F6F3] placeholder:text-[#888888]',
              }}
            />
          </div>
        </section>

        {filteredClubs.length === 0 ? (
          <section className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] px-6 py-12 text-center">
            <p className="text-[32px] text-[#F7F6F3]/20">⌕</p>
            <p className="mt-3 text-[15px] text-[#F7F6F3]">Aucun club trouvé</p>
            <div className="mt-4">
              <Button
                type="button"
                variant="ghost"
                className="min-h-11 text-sm text-[#C9973A]"
                onPress={() => setQuery('')}
              >
                Réinitialisez votre recherche
              </Button>
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClubs.map((club) => {
              const tags = club.vibe.split('·').map((tag) => tag.trim()).filter(Boolean);

              return (
                <article key={club.slug} className="space-y-3">
                  <Link href={`/clubs/${club.slug}`} className="group relative block aspect-video overflow-hidden rounded-xl">
                    <Image
                      src={club.image}
                      alt={`Photo du club ${club.name}`}
                      width={1400}
                      height={788}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#050508] opacity-0 transition-opacity duration-[400ms] group-hover:opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100">
                      <span className="text-sm uppercase tracking-widest text-[#C9973A]">Voir les tables →</span>
                    </div>
                  </Link>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-[#F7F6F3]">{club.name}</h2>
                    <p className="text-[13px] text-[#888888]">{club.area}</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Chip key={`${club.slug}-${tag}`} size="sm" variant="flat" color="default" className="bg-[#0A0F2E] text-[#888888]">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-[#C9973A]">Dès {club.minConsumption.replace('À partir de ', '')}</p>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}