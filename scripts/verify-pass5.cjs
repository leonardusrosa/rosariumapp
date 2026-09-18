try { process.loadEnvFile(); } catch {}
const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

async function runVerifications() {
  console.log('=== BIBLIOTHECA PASS 5 COMPLETE END-TO-END VERIFICATION ===\n');

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const sb = createClient(supabaseUrl, anonKey);

  const pgClient = new Client({
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.prtxsvgpjpgzzoxyhmrf',
    password: '@VasilyFTW11337798',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await pgClient.connect();

  let passed = 0;
  let failed = 0;

  function assert(condition, description) {
    if (condition) {
      console.log(`[PASS] ${description}`);
      passed++;
    } else {
      console.error(`[FAIL] ${description}`);
      failed++;
    }
  }

  try {
    // 1. Validate function security definition & pinned search_path
    console.log('\n--- 1. Function Privileges & SECURITY DEFINER configuration ---');
    const funcRes = await pgClient.query(`
      SELECT 
        proname, 
        prosecdef,
        proconfig
      FROM pg_proc 
      WHERE proname LIKE 'bibliotheca_%'
    `);

    for (const row of funcRes.rows) {
      const isSecDef = row.prosecdef === true;
      const searchPathConfig = (row.proconfig || []).find(c => c.startsWith('search_path='));
      assert(isSecDef, `Function ${row.proname} is SECURITY DEFINER`);
      assert(
        searchPathConfig === 'search_path=""' || searchPathConfig === 'search_path=',
        `Function ${row.proname} has pinned empty search_path: ${searchPathConfig}`
      );
    }

    // 2. Validate EXECUTE privileges for anon vs authenticated
    console.log('\n--- 2. EXECUTE privilege isolation (anon revoked, authenticated granted) ---');
    const privRes = await pgClient.query(`
      SELECT 
        proname,
        has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_exec,
        has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_can_exec
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND proname LIKE 'bibliotheca_%'
    `);

    for (const row of privRes.rows) {
      assert(row.anon_can_exec === false, `anon CANNOT execute ${row.proname}`);
      assert(row.auth_can_exec === true, `authenticated CAN execute ${row.proname}`);
    }

    // Register two real test users in auth.users
    console.log('\n--- Setting up authentic test accounts in Supabase ---');
    const ts = Date.now();
    const emailA = `test_biblio_a_${ts}@example.com`;
    const emailB = `test_biblio_b_${ts}@example.com`;
    const testPassword = 'Password123!@#';

    const { data: signUpA, error: errA } = await sb.auth.signUp({ email: emailA, password: testPassword });
    const { data: signUpB, error: errB } = await sb.auth.signUp({ email: emailB, password: testPassword });

    if (errA || errB || !signUpA.user || !signUpB.user) {
      throw new Error(`Failed to create test users: ${errA?.message || errB?.message}`);
    }

    const userA = signUpA.user.id;
    const userB = signUpB.user.id;
    console.log(`Created User A: ${userA} (${emailA})`);
    console.log(`Created User B: ${userB} (${emailB})`);

    // Clean any leftover records in dependency order
    await pgClient.query(`
      DELETE FROM public.bibliotheca_notes WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_reading_records WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_queue_items WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_wishlist_items WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_library_items WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_editions WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_works WHERE user_id IN ('${userA}', '${userB}');
    `);

    // 3. Authenticated RPC: verify auth.uid() is derived from caller
    console.log('\n--- 3. RPC caller derivation from auth.uid() ---');
    await pgClient.query(`SET ROLE authenticated`);
    await pgClient.query(`SET "request.jwt.claim.sub" = '${userA}'`);

    const addRes = await pgClient.query(`
      SELECT public.bibliotheca_add_book(
        p_work := '{"id": "w-test-1", "title": "Confissões", "author": "Santo Agostinho"}'::jsonb,
        p_edition := '{"id": "ed-test-1", "isbn": "9788535902778", "cover": {"type": "generated"}}'::jsonb,
        p_library_item := '{"id": "item-test-1", "readingStatus": "read"}'::jsonb,
        p_reading_record := '{"id": "rr-test-1", "finishedAt": "2026-09-18T10:00:00Z"}'::jsonb,
        p_queue_item := NULL
      )
    `);
    assert(addRes.rows.length === 1, 'bibliotheca_add_book executed for authenticated userA');

    const workRowA = await pgClient.query(`SELECT * FROM public.bibliotheca_works WHERE id = 'w-test-1'`);
    assert(workRowA.rows.length === 1 && workRowA.rows[0].user_id === userA, 'Work stored with user_id derived strictly from auth.uid()');

    // 4. Cross-account RLS isolation: User B cannot see User A's rows
    console.log('\n--- 4. Cross-account RLS isolation ---');
    await pgClient.query(`SET "request.jwt.claim.sub" = '${userB}'`);
    const userBSelect = await pgClient.query(`SELECT * FROM public.bibliotheca_works WHERE id = 'w-test-1'`);
    assert(userBSelect.rows.length === 0, 'User B cannot see User A works (RLS filtered to 0 rows)');

    // 5. Attempt UPDATE changing user_id must be denied by WITH CHECK policy
    console.log('\n--- 5. Attempt UPDATE changing user_id ---');
    await pgClient.query(`SET "request.jwt.claim.sub" = '${userA}'`);
    let spoofUpdateThrew = false;
    try {
      await pgClient.query(`UPDATE public.bibliotheca_works SET user_id = '${userB}' WHERE id = 'w-test-1'`);
    } catch (e) {
      spoofUpdateThrew = true;
    }
    assert(spoofUpdateThrew, 'UPDATE changing user_id was denied by RLS WITH CHECK policy');

    // 6. Database-level exact normalized ISBN duplicate protection per user
    console.log('\n--- 6. Exact normalized ISBN duplicate protection ---');
    let duplicateIsbnThrew = false;
    try {
      await pgClient.query(`
        INSERT INTO public.bibliotheca_editions (user_id, id, work_id, isbn, cover)
        VALUES ('${userA}', 'ed-test-dup', 'w-test-1', '9788535902778', '{"type": "generated"}'::jsonb)
      `);
    } catch (e) {
      duplicateIsbnThrew = true;
    }
    assert(duplicateIsbnThrew, 'Duplicate exact ISBN for same user blocked by unique index');

    // Different edition of the same work with different ISBN is allowed
    let diffEdAllowed = true;
    try {
      await pgClient.query(`
        INSERT INTO public.bibliotheca_editions (user_id, id, work_id, isbn, cover)
        VALUES ('${userA}', 'ed-test-diff', 'w-test-1', '9788535902779', '{"type": "generated"}'::jsonb)
      `);
    } catch (e) {
      diffEdAllowed = false;
    }
    assert(diffEdAllowed, 'Different edition of the same work is allowed');

    // 7. Transactional bulk shelf ingestion failure atomicity
    console.log('\n--- 7. Bulk shelf ingestion atomicity (all-or-nothing) ---');
    const batchWithBadItem = [
      {
        work: { id: "w-bulk-1", title: "Bulk 1", author: "Author 1" },
        edition: { id: "ed-bulk-1", isbn: "9781111111111", cover: { type: "generated" } },
        libraryItem: { id: "item-bulk-1", readingStatus: "unread" }
      },
      {
        // Deliberately violating ISBN unique constraint by reusing existing ISBN 9788535902778
        work: { id: "w-bulk-2", title: "Bulk 2", author: "Author 2" },
        edition: { id: "ed-bulk-2", isbn: "9788535902778", cover: { type: "generated" } },
        libraryItem: { id: "item-bulk-2", readingStatus: "unread" }
      }
    ];

    let batchThrew = false;
    try {
      await pgClient.query(`SELECT public.bibliotheca_add_books($1::jsonb)`, [JSON.stringify(batchWithBadItem)]);
    } catch (e) {
      batchThrew = true;
    }
    assert(batchThrew, 'Bulk add books with failing candidate threw exception');

    const checkBulk1 = await pgClient.query(`SELECT * FROM public.bibliotheca_works WHERE id = 'w-bulk-1'`);
    assert(checkBulk1.rows.length === 0, 'Atomicity verified: 0 rows remained from aborted bulk batch');

    // 8. Safe non-merging local import: rejects import when cloud is not empty
    console.log('\n--- 8. Safe non-merging local import ---');
    let importThrew = false;
    try {
      await pgClient.query(`
        SELECT public.bibliotheca_import_library($1::jsonb)
      `, [JSON.stringify({
        works: [{ id: "w-imp-1", title: "Import 1", author: "Imp Author" }],
        editions: [{ id: "ed-imp-1", workId: "w-imp-1", cover: { type: "generated" } }],
        libraryItems: [{ id: "item-imp-1", editionId: "ed-imp-1", readingStatus: "unread" }],
        readingRecords: [],
        readingQueue: [],
        wishlistItems: [],
        notes: []
      })]);
    } catch (e) {
      importThrew = true;
      assert(e.message.includes('cloud_not_empty'), `Import threw expected 'cloud_not_empty' error: ${e.message}`);
    }
    assert(importThrew, 'Import safely rejected because user cloud library is not empty');

    // 9. Foreign key delete semantics: removing owned copy does NOT delete reading history or notes
    console.log('\n--- 9. Foreign key delete semantics (Work, ReadingRecords and Notes survive) ---');
    await pgClient.query(`
      INSERT INTO public.bibliotheca_notes (user_id, id, work_id, library_item_id, content)
      VALUES ('${userA}', 'note-test-1', 'w-test-1', 'item-test-1', 'Anotação histórica de teste')
    `);

    // Delete library item
    await pgClient.query(`DELETE FROM public.bibliotheca_library_items WHERE id = 'item-test-1'`);

    // Verify ReadingRecord still exists
    const rrCheck = await pgClient.query(`SELECT * FROM public.bibliotheca_reading_records WHERE id = 'rr-test-1'`);
    assert(rrCheck.rows.length === 1, 'Historical ReadingRecord preserved after library item deleted');

    // Verify Note still exists, with library_item_id set to null
    const noteCheck = await pgClient.query(`SELECT * FROM public.bibliotheca_notes WHERE id = 'note-test-1'`);
    assert(noteCheck.rows.length === 1 && noteCheck.rows[0].library_item_id === null, 'Note preserved with library_item_id set to NULL');

    // Verify Work still exists
    const workCheck = await pgClient.query(`SELECT * FROM public.bibliotheca_works WHERE id = 'w-test-1'`);
    assert(workCheck.rows.length === 1, 'Work preserved after library item deleted');

    // 10. Clean up test user records in dependency order (respecting RESTRICT)
    console.log('\n--- 10. Clean up test user records ---');
    await pgClient.query(`RESET ROLE`);
    await pgClient.query(`
      DELETE FROM public.bibliotheca_notes WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_reading_records WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_queue_items WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_wishlist_items WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_library_items WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_editions WHERE user_id IN ('${userA}', '${userB}');
      DELETE FROM public.bibliotheca_works WHERE user_id IN ('${userA}', '${userB}');
    `);
    console.log('[PASS] Test cleanup completed in proper dependency order');
    passed++;

    console.log(`\n=================================================`);
    console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`=================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    await pgClient.end();
  }
}

runVerifications().catch(e => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
