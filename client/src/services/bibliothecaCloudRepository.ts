import { supabase } from "@/lib/supabase";
import {
  ReadingStatus,
  BookNote,
} from "@/types/bibliotheca";
import { BibliothecaState, AddBookParams, AddBookResult } from "@/contexts/bibliothecaTypes";
import {
  mapWorkRow,
  mapEditionRow,
  mapLibraryItemRow,
  mapReadingRecordRow,
  mapQueueItemRow,
  mapWishlistItemRow,
  mapNoteRow,
  buildImportPayload,
} from "./bibliothecaCloudMappers";
import {
  buildAddBookRpcPayload,
  buildAddBooksBatchRpcPayload,
} from "./bibliothecaCloudPayloads";

export class BibliothecaCloudRepository {
  private ensureClient() {
    if (!supabase) {
      throw new Error("Supabase client is not available.");
    }
    return supabase;
  }

  async isCloudLibraryEmpty(): Promise<boolean> {
    const client = this.ensureClient();
    const { count, error } = await client
      .from("bibliotheca_library_items")
      .select("id", { count: "exact", head: true });

    if (error) throw error;
    return (count ?? 0) === 0;
  }

  async fetchCloudLibrary(): Promise<BibliothecaState> {
    const client = this.ensureClient();

    const [wRes, eRes, lRes, rRes, qRes, wlRes, nRes] = await Promise.all([
      client.from("bibliotheca_works").select("*"),
      client.from("bibliotheca_editions").select("*"),
      client.from("bibliotheca_library_items").select("*"),
      client.from("bibliotheca_reading_records").select("*").order("created_at", { ascending: false }),
      client.from("bibliotheca_queue_items").select("*").order("position", { ascending: true }),
      client.from("bibliotheca_wishlist_items").select("*").order("added_at", { ascending: false }),
      client.from("bibliotheca_notes").select("*").order("created_at", { ascending: false }),
    ]);

    if (wRes.error) throw wRes.error;
    if (eRes.error) throw eRes.error;
    if (lRes.error) throw lRes.error;
    if (rRes.error) throw rRes.error;
    if (qRes.error) throw qRes.error;
    if (wlRes.error) throw wlRes.error;
    if (nRes.error) throw nRes.error;

    return {
      works: (wRes.data || []).map(mapWorkRow),
      editions: (eRes.data || []).map(mapEditionRow),
      libraryItems: (lRes.data || []).map(mapLibraryItemRow),
      readingRecords: (rRes.data || []).map(mapReadingRecordRow),
      readingQueue: (qRes.data || []).map(mapQueueItemRow),
      wishlistItems: (wlRes.data || []).map(mapWishlistItemRow),
      notes: (nRes.data || []).map(mapNoteRow),
      schemaVersion: 2,
    };
  }

  async addBookToCloud(params: AddBookParams): Promise<AddBookResult> {
    const client = this.ensureClient();
    const payload = buildAddBookRpcPayload(params);

    const { data, error } = await client.rpc("bibliotheca_add_book", {
      p_work: payload.p_work,
      p_edition: payload.p_edition,
      p_library_item: payload.p_library_item,
      p_reading_record: payload.p_reading_record,
      p_queue_item: payload.p_queue_item,
    });

    if (error) throw error;
    return {
      workId: data.workId || payload.workId,
      libraryItemId: data.libraryItemId || payload.libraryItemId,
    };
  }

  async addBooksToCloud(paramsList: AddBookParams[]): Promise<AddBookResult[]> {
    const client = this.ensureClient();
    const p_batch = buildAddBooksBatchRpcPayload(paramsList);

    const { data, error } = await client.rpc("bibliotheca_add_books", { p_batch });
    if (error) throw error;
    return (data as any[]) || [];
  }

  async importLocalToCloud(state: BibliothecaState) {
    const client = this.ensureClient();
    const payload = buildImportPayload(state);
    const { data, error } = await client.rpc("bibliotheca_import_library", {
      p_payload: payload,
    });
    if (error) throw error;
    return data as {
      works: number;
      editions: number;
      libraryItems: number;
      readingRecords: number;
      queueItems: number;
      wishlistItems: number;
      notes: number;
    };
  }

  async updateReadingStatusInCloud(
    libraryItemId: string,
    nextStatus: ReadingStatus,
    prevStatus: ReadingStatus,
    editionId: string,
    workId: string
  ): Promise<void> {
    const client = this.ensureClient();
    const { error: updateErr } = await client
      .from("bibliotheca_library_items")
      .update({ reading_status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", libraryItemId);

    if (updateErr) throw updateErr;

    if (nextStatus === "read" && prevStatus !== "read") {
      const { error: rrErr } = await client.from("bibliotheca_reading_records").insert({
        id: `rr-cloud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        work_id: workId,
        edition_id: editionId,
        finished_at: new Date().toISOString(),
      });
      if (rrErr) throw rrErr;
    }
  }

  async toggleQueueInCloud(
    workId: string,
    libraryItemId?: string,
    existingQueueItemId?: string,
    nextPosition?: number
  ): Promise<void> {
    const client = this.ensureClient();
    if (existingQueueItemId) {
      const { error } = await client.from("bibliotheca_queue_items").delete().eq("id", existingQueueItemId);
      if (error) throw error;
    } else {
      const { error } = await client.from("bibliotheca_queue_items").insert({
        id: `rq-cloud-${Date.now()}`,
        work_id: workId,
        library_item_id: libraryItemId || null,
        position: nextPosition || 1,
      });
      if (error) throw error;
    }
  }

  async removeFromQueueInCloud(queueItemId: string): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client.from("bibliotheca_queue_items").delete().eq("id", queueItemId);
    if (error) throw error;
  }

  async reorderQueueInCloud(queueIds: string[]): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client.rpc("bibliotheca_reorder_queue", { p_queue_ids: queueIds });
    if (error) throw error;
  }

  async toggleWishlistInCloud(
    workId: string,
    editionId?: string,
    existingWishlistId?: string
  ): Promise<void> {
    const client = this.ensureClient();
    if (existingWishlistId) {
      const { error } = await client.from("bibliotheca_wishlist_items").delete().eq("id", existingWishlistId);
      if (error) throw error;
    } else {
      const { error } = await client.from("bibliotheca_wishlist_items").insert({
        id: `wl-cloud-${Date.now()}`,
        work_id: workId,
        edition_id: editionId || null,
      });
      if (error) throw error;
    }
  }

  async removeFromWishlistInCloud(wishlistItemId: string): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client.from("bibliotheca_wishlist_items").delete().eq("id", wishlistItemId);
    if (error) throw error;
  }

  async addNoteToCloud(note: BookNote): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client.from("bibliotheca_notes").insert({
      id: note.id,
      work_id: note.workId,
      library_item_id: note.libraryItemId || null,
      content: note.content,
      page: note.page ?? null,
      chapter: note.chapter || null,
    });
    if (error) throw error;
  }

  async updateNoteInCloud(id: string, content: string, page?: number, chapter?: string): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client
      .from("bibliotheca_notes")
      .update({
        content,
        page: page ?? null,
        chapter: chapter || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
  }

  async deleteNoteInCloud(id: string): Promise<void> {
    const client = this.ensureClient();
    const { error } = await client.from("bibliotheca_notes").delete().eq("id", id);
    if (error) throw error;
  }
}

export const bibliothecaCloudRepo = new BibliothecaCloudRepository();
