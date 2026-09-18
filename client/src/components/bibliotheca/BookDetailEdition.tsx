import React from "react";
import { Work, Edition } from "@/types/bibliotheca";

interface BookDetailEditionProps {
  work: Work;
  edition?: Edition;
}

export function BookDetailEdition({ work, edition }: BookDetailEditionProps) {
  if (!edition) {
    return (
      <section aria-labelledby="edition-heading" className="py-8 border-b border-[var(--ancient-gold-alpha-soft)]">
        <h2
          id="edition-heading"
          className="font-cinzel text-lg font-semibold tracking-wider text-[var(--parchment)] mb-3"
        >
          Edição Registrada
        </h2>
        <p className="font-cormorant text-sm italic text-[var(--sacred-ivory)]/60">
          Nenhuma edição física específica associada a este título no momento. Os dados exibidos referem-se à obra canônica.
        </p>
      </section>
    );
  }

  const fields = [
    { label: "Editora", value: edition.publisher },
    { label: "Ano desta edição", value: edition.publicationYear ? String(edition.publicationYear) : undefined },
    {
      label: "Ano da obra original",
      value: work.originalPublicationYear
        ? work.originalPublicationYear < 0
          ? `${Math.abs(work.originalPublicationYear)} a.C.`
          : String(work.originalPublicationYear)
        : undefined
    },
    { label: "Tradutor", value: edition.translator },
    { label: "ISBN", value: edition.isbn },
    { label: "Formato", value: edition.format },
    { label: "Idioma da edição", value: edition.language || "Português" },
    { label: "Número de páginas", value: edition.pages ? `${edition.pages} páginas` : undefined }
  ].filter((f) => !!f.value);

  return (
    <section aria-labelledby="edition-heading" className="py-8 border-b border-[var(--ancient-gold-alpha-soft)]">
      <div className="mb-4">
        <h2
          id="edition-heading"
          className="font-cinzel text-lg font-semibold tracking-wider text-[var(--parchment)]"
        >
          Edição do Exemplar
        </h2>
        <p className="font-cormorant text-xs italic text-[var(--sacred-ivory)]/60 mt-0.5">
          Identificação bibliográfica exata do volume catalogado.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {fields.map((field) => (
          <div
            key={field.label}
            className="p-3 rounded-lg bg-[var(--stone-gray-alpha)]/25 border border-[var(--ancient-gold-alpha-soft)]/50"
          >
            <span className="block font-cinzel text-[11px] font-medium tracking-wider text-[var(--ancient-gold)] uppercase">
              {field.label}
            </span>
            <span className="block font-inter text-xs text-[var(--parchment)] mt-1 font-medium break-words">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BookDetailEdition;
