import React, { useState } from "react";
import { BookNote } from "@/types/bibliotheca";
import { Plus, Edit2, Trash2, Check, X, NotebookPen } from "lucide-react";

interface BookDetailNotesProps {
  notes: BookNote[];
  workId: string;
  libraryItemId?: string;
  onAddNote: (data: { workId: string; libraryItemId?: string; content: string; page?: number; chapter?: string }) => void;
  onUpdateNote: (id: string, content: string, page?: number, chapter?: string) => void;
  onDeleteNote: (id: string) => void;
}

export function BookDetailNotes({
  notes,
  workId,
  libraryItemId,
  onAddNote,
  onUpdateNote,
  onDeleteNote
}: BookDetailNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for new note
  const [newContent, setNewContent] = useState("");
  const [newPage, setNewPage] = useState<string>("");
  const [newChapter, setNewChapter] = useState("");

  // Form states for edit note
  const [editContent, setEditContent] = useState("");
  const [editPage, setEditPage] = useState<string>("");
  const [editChapter, setEditChapter] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddNote({
      workId,
      libraryItemId,
      content: newContent,
      page: newPage ? parseInt(newPage, 10) : undefined,
      chapter: newChapter || undefined
    });

    setNewContent("");
    setNewPage("");
    setNewChapter("");
    setIsAdding(false);
  };

  const startEditing = (note: BookNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
    setEditPage(note.page !== undefined ? String(note.page) : "");
    setEditChapter(note.chapter || "");
  };

  const handleEditSubmit = (e: React.FormEvent, noteId: string) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    onUpdateNote(
      noteId,
      editContent,
      editPage ? parseInt(editPage, 10) : undefined,
      editChapter || undefined
    );

    setEditingId(null);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <section aria-labelledby="notes-heading" className="py-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <NotebookPen className="w-5 h-5 text-[var(--ancient-gold)]" />
          <h2 id="notes-heading" className="font-cinzel text-lg font-semibold tracking-wider text-[var(--parchment)]">
            Notas Atômicas ({notes.length})
          </h2>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ancient-gold-warm)] hover:bg-[var(--ancient-gold-bright)] text-[var(--cathedral-void)] font-cinzel text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Adicionar Nota</span>
          </button>
        )}
      </div>

      {/* New Note Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-4 rounded-xl bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-warm)]/40 mb-6 space-y-3 shadow-lg"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[var(--ancient-gold-alpha-soft)]">
            <span className="font-cinzel text-xs font-semibold text-[var(--ancient-gold-bright)] uppercase tracking-wider">
              Nova Anotação de Leitura
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[var(--sacred-ivory)]/50 hover:text-[var(--parchment)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <textarea
            required
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Registre um pensamento, passagem ou reflexão atômica sobre este trecho..."
            className="w-full p-3 rounded-lg bg-[var(--cathedral-void)] border border-[var(--ancient-gold-alpha-soft)] text-xs text-[var(--parchment)] placeholder:text-[var(--sacred-ivory)]/40 focus:outline-none focus:border-[var(--ancient-gold-warm)] font-cormorant text-base"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={newPage}
                onChange={(e) => setNewPage(e.target.value)}
                placeholder="Pág. (opcional)"
                className="w-24 px-2.5 py-1.5 rounded bg-[var(--cathedral-void)] border border-[var(--ancient-gold-alpha-soft)] text-xs text-[var(--parchment)] placeholder:text-[var(--sacred-ivory)]/40 focus:outline-none focus:border-[var(--ancient-gold-warm)]"
              />
              <input
                type="text"
                value={newChapter}
                onChange={(e) => setNewChapter(e.target.value)}
                placeholder="Capítulo / Seção"
                className="w-36 px-2.5 py-1.5 rounded bg-[var(--cathedral-void)] border border-[var(--ancient-gold-alpha-soft)] text-xs text-[var(--parchment)] placeholder:text-[var(--sacred-ivory)]/40 focus:outline-none focus:border-[var(--ancient-gold-warm)]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded text-xs font-inter text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[var(--ancient-gold-warm)] hover:bg-[var(--ancient-gold-bright)] text-[var(--cathedral-void)] text-xs font-cinzel font-semibold uppercase tracking-wider shadow-sm"
              >
                Salvar Nota
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Note List */}
      {notes.length === 0 ? (
        <div className="py-8 text-center rounded-lg bg-[var(--stone-gray-alpha)]/15 border border-[var(--ancient-gold-alpha-soft)]/40">
          <p className="font-cormorant text-base italic text-[var(--sacred-ivory)]/60">
            Nenhuma nota registrada para este livro ainda.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            if (editingId === note.id) {
              return (
                <form
                  key={note.id}
                  onSubmit={(e) => handleEditSubmit(e, note.id)}
                  className="p-4 rounded-lg bg-[var(--stone-gray-alpha)]/50 border border-[var(--ancient-gold-warm)]/40 space-y-3"
                >
                  <textarea
                    required
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2.5 rounded bg-[var(--cathedral-void)] border border-[var(--ancient-gold-alpha-soft)] text-xs text-[var(--parchment)] font-cormorant text-base"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editPage}
                        onChange={(e) => setEditPage(e.target.value)}
                        placeholder="Página"
                        className="w-20 px-2 py-1 rounded bg-[var(--cathedral-void)] border border-[var(--ancient-gold-alpha-soft)] text-xs text-[var(--parchment)]"
                      />
                      <input
                        type="text"
                        value={editChapter}
                        onChange={(e) => setEditChapter(e.target.value)}
                        placeholder="Capítulo"
                        className="w-32 px-2 py-1 rounded bg-[var(--cathedral-void)] border border-[var(--ancient-gold-alpha-soft)] text-xs text-[var(--parchment)]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1 text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--ancient-gold-warm)] text-[var(--cathedral-void)] text-xs font-inter font-medium"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Salvar</span>
                      </button>
                    </div>
                  </div>
                </form>
              );
            }

            return (
              <article
                key={note.id}
                className="p-4 rounded-lg bg-[var(--stone-gray-alpha)]/25 hover:bg-[var(--stone-gray-alpha)]/40 border border-[var(--ancient-gold-alpha-soft)] transition-colors group"
              >
                <div className="flex items-center justify-between text-xs text-[var(--sacred-ivory)]/50 mb-1.5">
                  <div className="flex items-center gap-2">
                    {note.page && (
                      <span className="font-inter font-medium text-[var(--ancient-gold)]">
                        Pág. {note.page}
                      </span>
                    )}
                    {note.chapter && (
                      <span className="font-inter text-[var(--sacred-ivory)]/60">
                        • {note.chapter}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span>{formatDate(note.createdAt)}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-2">
                      <button
                        type="button"
                        onClick={() => startEditing(note)}
                        title="Editar nota"
                        className="p-1 rounded text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        title="Excluir nota"
                        className="p-1 rounded text-[var(--sacred-ivory)]/60 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="font-cormorant text-base sm:text-lg text-[var(--parchment)]/90 leading-relaxed whitespace-pre-line">
                  {note.content}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default BookDetailNotes;
