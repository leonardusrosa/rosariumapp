import { IdentifiedBookCandidate } from "@/types/bibliotheca";
import { AddBookParams } from "@/contexts/BibliothecaContext";

export function candidatesToAddBookParams(selected: IdentifiedBookCandidate[]): AddBookParams[] {
  return selected.map((c) => ({
    workDraft: {
      title: c.editedTitle || c.title,
      author: c.editedAuthor || c.author || "Autor desconhecido",
      originalPublicationYear: c.originalPublicationYear,
    },
    editionDraft: {
      publisher: c.possibleEdition?.publisher,
      publicationYear: c.possibleEdition?.publicationYear,
      translator: c.possibleEdition?.translator,
      language: c.possibleEdition?.language,
      pages: c.possibleEdition?.pages,
      format: c.possibleEdition?.format,
      isbn: c.possibleEdition?.isbn,
      cover: c.remoteCoverUrl
        ? {
            type: "remote",
            url: c.remoteCoverUrl,
            source: c.providerMeta?.primary,
            fallback: {
              type: "generated",
              style: "minimal",
              primaryColor: "#1c2024",
              accentColor: "#c9a35e",
              textColor: "#f3eee5",
            },
          }
        : {
            type: "generated",
            style: "minimal",
            primaryColor: "#1c2024",
            accentColor: "#c9a35e",
            textColor: "#f3eee5",
          },
      providerMeta: c.providerMeta,
    },
    readingStatus: c.readingStatus || "unread",
    addToQueue: c.addToQueue || false,
  }));
}
