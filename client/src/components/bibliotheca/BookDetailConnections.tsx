import React from "react";
import { Link } from "wouter";
import { Work, Edition } from "@/types/bibliotheca";
import { BookCover } from "./BookCover";
import { Network } from "lucide-react";

interface ConnectedBookItem {
  work: Work;
  edition?: Edition;
  relationshipNote?: string;
}

interface BookDetailConnectionsProps {
  connections: ConnectedBookItem[];
}

export function BookDetailConnections({ connections }: BookDetailConnectionsProps) {
  if (connections.length === 0) return null;

  return (
    <section aria-labelledby="connections-heading" className="py-8 border-b border-[var(--ancient-gold-alpha-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <Network className="w-5 h-5 text-[var(--ancient-gold)]" />
        <h2
          id="connections-heading"
          className="font-cinzel text-lg font-semibold tracking-wider text-[var(--parchment)]"
        >
          Conexões na Sua Biblioteca
        </h2>
      </div>

      <p className="font-cormorant text-sm italic text-[var(--sacred-ivory)]/70 mb-5">
        Obras presentes no seu acervo que dialogam com os temas, época ou questões desta leitura.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {connections.map(({ work, edition }) => {
          const fallbackCover = {
            style: "minimal" as const,
            primaryColor: "#1a1d20",
            accentColor: "#c89f55",
            textColor: "#ede8dd"
          };

          return (
            <Link
              key={work.id}
              href={`/book/${work.id}`}
              className="group flex flex-col p-2 rounded-lg bg-[var(--stone-gray-alpha)]/20 hover:bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-alpha-soft)] hover:border-[var(--ancient-gold-warm)]/50 transition-all duration-300"
            >
              <div className="aspect-[2/3] w-full rounded overflow-hidden shadow-md group-hover:shadow-lg transition-transform duration-300 group-hover:-translate-y-0.5">
                <BookCover
                  title={work.title}
                  author={work.author}
                  cover={edition?.cover || fallbackCover}
                />
              </div>

              <div className="pt-2 px-0.5">
                <h3 className="font-cinzel text-xs font-semibold text-[var(--parchment)] group-hover:text-[var(--ancient-gold-bright)] line-clamp-1 leading-tight transition-colors">
                  {work.title}
                </h3>
                <p className="font-cormorant text-xs italic text-[var(--sacred-ivory)]/60 line-clamp-1 mt-0.5">
                  {work.author}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default BookDetailConnections;
