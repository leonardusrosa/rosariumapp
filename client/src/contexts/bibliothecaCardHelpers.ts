import { BibliothecaState } from "./bibliothecaTypes";
import { BookCardViewModel } from "@/types/bibliotheca";

export function buildLibraryCards(state: BibliothecaState): BookCardViewModel[] {
  const editionMap = new Map(state.editions.map((e) => [e.id, e]));
  const workMap = new Map(state.works.map((w) => [w.id, w]));
  const queuedWorks = new Set(state.readingQueue.map((q) => q.workId));

  return state.libraryItems.map((item) => {
    const edition = editionMap.get(item.editionId);
    const work = edition ? workMap.get(edition.workId) : undefined;
    const notesForBook = state.notes.filter((n) => n.workId === work?.id);

    return {
      itemId: item.id,
      workId: work?.id || "",
      editionId: item.editionId,
      title: work?.title || "Obra sem título",
      originalTitle: work?.originalTitle,
      author: work?.author || "Autor desconhecido",
      publisher: edition?.publisher,
      publicationYear: edition?.publicationYear,
      readingStatus: item.readingStatus,
      isNextRead: queuedWorks.has(work?.id || ""),
      notesCount: notesForBook.length,
      cover: edition?.cover || {
        type: "generated",
        style: "minimal",
        primaryColor: "#1a1d20",
        accentColor: "#c89f55",
        textColor: "#ede8dd",
      },
    };
  });
}

export function buildLectioCards(cards: BookCardViewModel[]): BookCardViewModel[] {
  return cards.filter((card) => card.readingStatus === "reading");
}
