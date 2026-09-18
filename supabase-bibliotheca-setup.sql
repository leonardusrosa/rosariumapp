-- ==============================================================================
-- Bibliotheca Cloud Persistence Setup Script
-- Tables, Constraints, Row Level Security, Indexes, and Transactional RPCs
-- ==============================================================================

-- 1. Tables --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.bibliotheca_works (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  title TEXT NOT NULL,
  original_title TEXT,
  author TEXT NOT NULL,
  original_publication_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, id)
);

CREATE TABLE IF NOT EXISTS public.bibliotheca_editions (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  work_id TEXT NOT NULL,
  isbn TEXT,
  publisher TEXT,
  publication_year INTEGER,
  translator TEXT,
  language TEXT,
  pages INTEGER,
  format TEXT,
  cover JSONB NOT NULL,
  provider_meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id, work_id) REFERENCES public.bibliotheca_works(user_id, id) ON DELETE RESTRICT
);

-- Exact ISBN uniqueness scoped per user (non-null / non-empty)
CREATE UNIQUE INDEX IF NOT EXISTS bibliotheca_editions_user_isbn_idx
  ON public.bibliotheca_editions (user_id, isbn)
  WHERE isbn IS NOT NULL AND isbn <> '';

CREATE TABLE IF NOT EXISTS public.bibliotheca_library_items (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  edition_id TEXT NOT NULL,
  reading_status TEXT NOT NULL CHECK (reading_status IN ('unread', 'reading', 'read')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id, edition_id) REFERENCES public.bibliotheca_editions(user_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.bibliotheca_reading_records (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  work_id TEXT NOT NULL,
  edition_id TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id, work_id) REFERENCES public.bibliotheca_works(user_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id, edition_id) REFERENCES public.bibliotheca_editions(user_id, id) ON DELETE SET NULL (edition_id)
);

CREATE TABLE IF NOT EXISTS public.bibliotheca_queue_items (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  work_id TEXT NOT NULL,
  library_item_id TEXT,
  position INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id, work_id) REFERENCES public.bibliotheca_works(user_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id, library_item_id) REFERENCES public.bibliotheca_library_items(user_id, id) ON DELETE SET NULL (library_item_id)
);

CREATE TABLE IF NOT EXISTS public.bibliotheca_wishlist_items (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  work_id TEXT NOT NULL,
  edition_id TEXT,
  desired_edition_notes TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id, work_id) REFERENCES public.bibliotheca_works(user_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id, edition_id) REFERENCES public.bibliotheca_editions(user_id, id) ON DELETE SET NULL (edition_id)
);

CREATE TABLE IF NOT EXISTS public.bibliotheca_notes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  work_id TEXT NOT NULL,
  library_item_id TEXT,
  content TEXT NOT NULL,
  page INTEGER,
  chapter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id, work_id) REFERENCES public.bibliotheca_works(user_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id, library_item_id) REFERENCES public.bibliotheca_library_items(user_id, id) ON DELETE SET NULL (library_item_id)
);

CREATE TABLE IF NOT EXISTS public.bibliotheca_enrichments (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  work_id TEXT NOT NULL,
  content JSONB NOT NULL,
  source TEXT,
  generation_meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, work_id),
  FOREIGN KEY (user_id, work_id) REFERENCES public.bibliotheca_works(user_id, id) ON DELETE CASCADE
);

-- 2. Indexes -------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_bib_works_user ON public.bibliotheca_works(user_id);
CREATE INDEX IF NOT EXISTS idx_bib_editions_work ON public.bibliotheca_editions(user_id, work_id);
CREATE INDEX IF NOT EXISTS idx_bib_lib_items_ed ON public.bibliotheca_library_items(user_id, edition_id);
CREATE INDEX IF NOT EXISTS idx_bib_reading_records_work ON public.bibliotheca_reading_records(user_id, work_id);
CREATE INDEX IF NOT EXISTS idx_bib_queue_pos ON public.bibliotheca_queue_items(user_id, position);
CREATE INDEX IF NOT EXISTS idx_bib_wishlist_work ON public.bibliotheca_wishlist_items(user_id, work_id);
CREATE INDEX IF NOT EXISTS idx_bib_notes_work ON public.bibliotheca_notes(user_id, work_id);

-- 3. Row Level Security --------------------------------------------------------

ALTER TABLE public.bibliotheca_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bibliotheca_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bibliotheca_library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bibliotheca_reading_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bibliotheca_queue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bibliotheca_wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bibliotheca_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bibliotheca_enrichments ENABLE ROW LEVEL SECURITY;

-- Macro policy definitions
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'bibliotheca_works',
    'bibliotheca_editions',
    'bibliotheca_library_items',
    'bibliotheca_reading_records',
    'bibliotheca_queue_items',
    'bibliotheca_wishlist_items',
    'bibliotheca_notes',
    'bibliotheca_enrichments'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_select" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_insert" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_update" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_delete" ON public.%I', t, t);

    EXECUTE format(
      'CREATE POLICY "%s_select" ON public.%I FOR SELECT TO authenticated USING ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.uid()) = user_id)',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "%s_insert" ON public.%I FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.uid()) = user_id)',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "%s_update" ON public.%I FOR UPDATE TO authenticated USING ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.uid()) = user_id)',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "%s_delete" ON public.%I FOR DELETE TO authenticated USING ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.uid()) = user_id)',
      t, t
    );
  END LOOP;
END $$;

-- 4. Transactional RPC Functions -----------------------------------------------

-- 4.1 bibliotheca_add_book
CREATE OR REPLACE FUNCTION public.bibliotheca_add_book(
  p_work JSONB,
  p_edition JSONB,
  p_library_item JSONB,
  p_reading_record JSONB DEFAULT NULL,
  p_queue_item JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_work_id TEXT;
  v_edition_id TEXT;
  v_item_id TEXT;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'unauthenticated';
  END IF;

  v_work_id := p_work->>'id';
  v_edition_id := p_edition->>'id';
  v_item_id := p_library_item->>'id';

  -- Upsert Work (do not overwrite if already existing)
  INSERT INTO public.bibliotheca_works (
    user_id, id, title, original_title, author, original_publication_year, created_at, updated_at
  ) VALUES (
    v_user_id,
    v_work_id,
    p_work->>'title',
    p_work->>'originalTitle',
    p_work->>'author',
    (p_work->>'originalPublicationYear')::INTEGER,
    NOW(),
    NOW()
  ) ON CONFLICT (user_id, id) DO NOTHING;

  -- Insert Edition
  INSERT INTO public.bibliotheca_editions (
    user_id, id, work_id, isbn, publisher, publication_year, translator, language, pages, format, cover, provider_meta, created_at, updated_at
  ) VALUES (
    v_user_id,
    v_edition_id,
    v_work_id,
    p_edition->>'isbn',
    p_edition->>'publisher',
    (p_edition->>'publicationYear')::INTEGER,
    p_edition->>'translator',
    p_edition->>'language',
    (p_edition->>'pages')::INTEGER,
    p_edition->>'format',
    p_edition->'cover',
    p_edition->'providerMeta',
    NOW(),
    NOW()
  );

  -- Insert LibraryItem
  INSERT INTO public.bibliotheca_library_items (
    user_id, id, edition_id, reading_status, created_at, updated_at
  ) VALUES (
    v_user_id,
    v_item_id,
    v_edition_id,
    p_library_item->>'readingStatus',
    NOW(),
    NOW()
  );

  -- Insert ReadingRecord if provided
  IF p_reading_record IS NOT NULL AND p_reading_record <> 'null'::JSONB THEN
    INSERT INTO public.bibliotheca_reading_records (
      user_id, id, work_id, edition_id, started_at, finished_at, created_at
    ) VALUES (
      v_user_id,
      p_reading_record->>'id',
      v_work_id,
      v_edition_id,
      (p_reading_record->>'startedAt')::TIMESTAMP WITH TIME ZONE,
      COALESCE((p_reading_record->>'finishedAt')::TIMESTAMP WITH TIME ZONE, NOW()),
      NOW()
    );
  END IF;

  -- Insert QueueItem if provided
  IF p_queue_item IS NOT NULL AND p_queue_item <> 'null'::JSONB THEN
    INSERT INTO public.bibliotheca_queue_items (
      user_id, id, work_id, library_item_id, position, added_at
    ) VALUES (
      v_user_id,
      p_queue_item->>'id',
      v_work_id,
      v_item_id,
      (p_queue_item->>'position')::INTEGER,
      NOW()
    );
  END IF;

  -- Remove matching WishlistItem atomically upon acquisition
  DELETE FROM public.bibliotheca_wishlist_items
  WHERE user_id = v_user_id AND work_id = v_work_id;

  RETURN jsonb_build_object('workId', v_work_id, 'libraryItemId', v_item_id);
END;
$$;

-- 4.2 bibliotheca_add_books (Atomic Bulk Shelf Ingestion)
CREATE OR REPLACE FUNCTION public.bibliotheca_add_books(
  p_batch JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_item JSONB;
  v_res JSONB;
  v_results JSONB := '[]'::JSONB;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'unauthenticated';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_batch) LOOP
    v_res := public.bibliotheca_add_book(
      v_item->'work',
      v_item->'edition',
      v_item->'libraryItem',
      v_item->'readingRecord',
      v_item->'queueItem'
    );
    v_results := v_results || jsonb_build_array(v_res);
  END LOOP;

  RETURN v_results;
END;
$$;

-- 4.3 bibliotheca_import_library (Full guest graph import with emptiness enforcement)
CREATE OR REPLACE FUNCTION public.bibliotheca_import_library(
  p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_rec JSONB;
  v_w_cnt INT := 0;
  v_e_cnt INT := 0;
  v_l_cnt INT := 0;
  v_rr_cnt INT := 0;
  v_q_cnt INT := 0;
  v_wl_cnt INT := 0;
  v_n_cnt INT := 0;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'unauthenticated';
  END IF;

  -- Verify cloud library is strictly empty to prevent uncontrolled merging
  IF EXISTS (SELECT 1 FROM public.bibliotheca_works WHERE user_id = v_user_id)
     OR EXISTS (SELECT 1 FROM public.bibliotheca_library_items WHERE user_id = v_user_id) THEN
    RAISE EXCEPTION 'cloud_not_empty';
  END IF;

  -- 1. Works
  IF p_payload->'works' IS NOT NULL THEN
    FOR v_rec IN SELECT * FROM jsonb_array_elements(p_payload->'works') LOOP
      INSERT INTO public.bibliotheca_works (
        user_id, id, title, original_title, author, original_publication_year, created_at, updated_at
      ) VALUES (
        v_user_id,
        v_rec->>'id',
        v_rec->>'title',
        v_rec->>'originalTitle',
        v_rec->>'author',
        (v_rec->>'originalPublicationYear')::INTEGER,
        NOW(),
        NOW()
      );
      v_w_cnt := v_w_cnt + 1;
    END LOOP;
  END IF;

  -- 2. Editions
  IF p_payload->'editions' IS NOT NULL THEN
    FOR v_rec IN SELECT * FROM jsonb_array_elements(p_payload->'editions') LOOP
      INSERT INTO public.bibliotheca_editions (
        user_id, id, work_id, isbn, publisher, publication_year, translator, language, pages, format, cover, provider_meta, created_at, updated_at
      ) VALUES (
        v_user_id,
        v_rec->>'id',
        v_rec->>'workId',
        v_rec->>'isbn',
        v_rec->>'publisher',
        (v_rec->>'publicationYear')::INTEGER,
        v_rec->>'translator',
        v_rec->>'language',
        (v_rec->>'pages')::INTEGER,
        v_rec->>'format',
        v_rec->'cover',
        v_rec->'providerMeta',
        NOW(),
        NOW()
      );
      v_e_cnt := v_e_cnt + 1;
    END LOOP;
  END IF;

  -- 3. Library Items
  IF p_payload->'libraryItems' IS NOT NULL THEN
    FOR v_rec IN SELECT * FROM jsonb_array_elements(p_payload->'libraryItems') LOOP
      INSERT INTO public.bibliotheca_library_items (
        user_id, id, edition_id, reading_status, created_at, updated_at
      ) VALUES (
        v_user_id,
        v_rec->>'id',
        v_rec->>'editionId',
        v_rec->>'readingStatus',
        COALESCE((v_rec->>'addedAt')::TIMESTAMP WITH TIME ZONE, NOW()),
        NOW()
      );
      v_l_cnt := v_l_cnt + 1;
    END LOOP;
  END IF;

  -- 4. Reading Records
  IF p_payload->'readingRecords' IS NOT NULL THEN
    FOR v_rec IN SELECT * FROM jsonb_array_elements(p_payload->'readingRecords') LOOP
      INSERT INTO public.bibliotheca_reading_records (
        user_id, id, work_id, edition_id, started_at, finished_at, created_at
      ) VALUES (
        v_user_id,
        v_rec->>'id',
        v_rec->>'workId',
        v_rec->>'editionId',
        (v_rec->>'startedAt')::TIMESTAMP WITH TIME ZONE,
        (v_rec->>'finishedAt')::TIMESTAMP WITH TIME ZONE,
        NOW()
      );
      v_rr_cnt := v_rr_cnt + 1;
    END LOOP;
  END IF;

  -- 5. Queue Items
  IF p_payload->'readingQueue' IS NOT NULL THEN
    FOR v_rec IN SELECT * FROM jsonb_array_elements(p_payload->'readingQueue') LOOP
      INSERT INTO public.bibliotheca_queue_items (
        user_id, id, work_id, library_item_id, position, added_at
      ) VALUES (
        v_user_id,
        v_rec->>'id',
        v_rec->>'workId',
        v_rec->>'libraryItemId',
        (v_rec->>'position')::INTEGER,
        COALESCE((v_rec->>'addedAt')::TIMESTAMP WITH TIME ZONE, NOW())
      );
      v_q_cnt := v_q_cnt + 1;
    END LOOP;
  END IF;

  -- 6. Wishlist Items
  IF p_payload->'wishlistItems' IS NOT NULL THEN
    FOR v_rec IN SELECT * FROM jsonb_array_elements(p_payload->'wishlistItems') LOOP
      INSERT INTO public.bibliotheca_wishlist_items (
        user_id, id, work_id, edition_id, desired_edition_notes, priority, added_at
      ) VALUES (
        v_user_id,
        v_rec->>'id',
        v_rec->>'workId',
        v_rec->>'editionId',
        v_rec->>'desiredEditionNotes',
        v_rec->>'priority',
        COALESCE((v_rec->>'addedAt')::TIMESTAMP WITH TIME ZONE, NOW())
      );
      v_wl_cnt := v_wl_cnt + 1;
    END LOOP;
  END IF;

  -- 7. Notes
  IF p_payload->'notes' IS NOT NULL THEN
    FOR v_rec IN SELECT * FROM jsonb_array_elements(p_payload->'notes') LOOP
      INSERT INTO public.bibliotheca_notes (
        user_id, id, work_id, library_item_id, content, page, chapter, created_at, updated_at
      ) VALUES (
        v_user_id,
        v_rec->>'id',
        v_rec->>'workId',
        v_rec->>'libraryItemId',
        v_rec->>'content',
        (v_rec->>'page')::INTEGER,
        v_rec->>'chapter',
        COALESCE((v_rec->>'createdAt')::TIMESTAMP WITH TIME ZONE, NOW()),
        COALESCE((v_rec->>'updatedAt')::TIMESTAMP WITH TIME ZONE, NOW())
      );
      v_n_cnt := v_n_cnt + 1;
    END LOOP;
  END IF;

  RETURN jsonb_build_object(
    'works', v_w_cnt,
    'editions', v_e_cnt,
    'libraryItems', v_l_cnt,
    'readingRecords', v_rr_cnt,
    'queueItems', v_q_cnt,
    'wishlistItems', v_wl_cnt,
    'notes', v_n_cnt
  );
END;
$$;

-- 4.4 bibliotheca_reorder_queue
CREATE OR REPLACE FUNCTION public.bibliotheca_reorder_queue(
  p_queue_ids TEXT[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  i INT;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'unauthenticated';
  END IF;

  FOR i IN 1..array_length(p_queue_ids, 1) LOOP
    UPDATE public.bibliotheca_queue_items
    SET position = i
    WHERE user_id = v_user_id AND id = p_queue_ids[i];
  END LOOP;
END;
$$;

-- 5. Privileges ----------------------------------------------------------------

-- Revoke execute from public and anon
REVOKE ALL ON FUNCTION public.bibliotheca_add_book(JSONB, JSONB, JSONB, JSONB, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.bibliotheca_add_books(JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.bibliotheca_import_library(JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.bibliotheca_reorder_queue(TEXT[]) FROM PUBLIC, anon;

-- Grant execute exclusively to authenticated role
GRANT EXECUTE ON FUNCTION public.bibliotheca_add_book(JSONB, JSONB, JSONB, JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bibliotheca_add_books(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bibliotheca_import_library(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bibliotheca_reorder_queue(TEXT[]) TO authenticated;
