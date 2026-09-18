try { process.loadEnvFile(); } catch {}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment.');
  process.exit(1);
}

const sb = createClient(supabaseUrl, supabaseKey);

function normalizeText(s) {
  if (!s) return '';
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const batch = [
  {
    workTitle: 'O Conde de Monte Cristo',
    workAuthor: 'Alexandre Dumas',
    publisher: 'Clássicos Zahar',
    format: 'Volume 1',
    subtitle: 'Volume 1',
    palette: { style: 'banded', primaryColor: '#1c2024', accentColor: '#c9a35e', textColor: '#f3eee5' }
  },
  {
    workTitle: 'O Conde de Monte Cristo',
    workAuthor: 'Alexandre Dumas',
    publisher: 'Clássicos Zahar',
    format: 'Volume 2',
    subtitle: 'Volume 2',
    palette: { style: 'banded', primaryColor: '#1c2024', accentColor: '#c9a35e', textColor: '#f3eee5' }
  },
  {
    workTitle: '12 Regras para a Vida',
    workAuthor: 'Jordan B. Peterson',
    publisher: 'Alta Books',
    format: null,
    subtitle: null,
    palette: { style: 'minimal', primaryColor: '#16202c', accentColor: '#d4af37', textColor: '#f7f4ee' }
  },
  {
    workTitle: 'A Divina Comédia',
    workAuthor: 'Dante Alighieri',
    publisher: 'Alta Books',
    format: null,
    subtitle: null,
    palette: { style: 'typographic', primaryColor: '#2b1417', accentColor: '#dfb15b', textColor: '#f5efe6' }
  },
  {
    workTitle: 'Anna Kariênina',
    workAuthor: 'Liev Tolstói',
    publisher: 'Companhia das Letras',
    format: null,
    subtitle: null,
    palette: { style: 'geometric', geometryShape: 'arch', primaryColor: '#18221b', accentColor: '#c2a649', textColor: '#f0eee9' }
  },
  {
    workTitle: 'Casamento e Paternidade',
    workAuthor: 'Gerrard',
    publisher: 'Caritatem',
    format: null,
    subtitle: null,
    palette: { style: 'minimal', primaryColor: '#241b18', accentColor: '#d9a05b', textColor: '#f8f3eb' }
  },
  {
    workTitle: 'Marxismo, Fascismo e Totalitarismo',
    workAuthor: 'A. James Gregor',
    publisher: 'Vide Editorial',
    format: null,
    subtitle: null,
    palette: { style: 'minimal', primaryColor: '#1e2226', accentColor: '#c5a059', textColor: '#ede8df' }
  },
  {
    workTitle: 'Fuga do Inferno',
    workAuthor: 'Sayragul Sauytbay; Alexandra Cavelius',
    publisher: 'Vide Editorial',
    format: null,
    subtitle: null,
    palette: { style: 'minimal', primaryColor: '#231818', accentColor: '#cf9752', textColor: '#f3ede6' }
  },
  {
    workTitle: 'O Diabo na História',
    workAuthor: 'Vladimir Tismaneanu',
    publisher: 'Vide Editorial',
    format: null,
    subtitle: null,
    palette: { style: 'minimal', primaryColor: '#1a1a1d', accentColor: '#c29b53', textColor: '#eeeae2' }
  },
  {
    workTitle: 'O Foro de São Paulo',
    workAuthor: 'Olavo de Carvalho',
    publisher: 'Vide Editorial',
    format: null,
    subtitle: null,
    palette: { style: 'minimal', primaryColor: '#19211c', accentColor: '#caa75a', textColor: '#f0ede6' }
  },
  {
    workTitle: 'Holodomor: O Holocausto Esquecido',
    workAuthor: 'Miron Dolot',
    publisher: 'Vide Editorial',
    format: null,
    subtitle: null,
    palette: { style: 'minimal', primaryColor: '#1a1e24', accentColor: '#c8a159', textColor: '#eeeae4' }
  }
];

async function main() {
  console.log('=== BIBLIOTHECA REAL BATCH REGISTRATION ===\n');

  // Authenticate as the existing Bibliotheca user
  const { data: authData, error: authError } = await sb.auth.signInWithPassword({
    email: 'leobiblio_pass5@test.com',
    password: 'Password123!@#'
  });

  if (authError || !authData.user) {
    console.error('Failed to authenticate as Bibliotheca user:', authError);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`Authenticated as Bibliotheca user: ${authData.user.email} (${userId})\n`);

  // Fetch current state
  const [wRes, eRes, lRes, wlRes] = await Promise.all([
    sb.from('bibliotheca_works').select('*'),
    sb.from('bibliotheca_editions').select('*'),
    sb.from('bibliotheca_library_items').select('*'),
    sb.from('bibliotheca_wishlist_items').select('*')
  ]);

  if (wRes.error || eRes.error || lRes.error || wlRes.error) {
    console.error('Failed to fetch existing Bibliotheca state:', wRes.error || eRes.error || lRes.error || wlRes.error);
    process.exit(1);
  }

  const currentWorks = [...(wRes.data || [])];
  const currentEditions = [...(eRes.data || [])];
  const currentItems = [...(lRes.data || [])];
  const currentWishlist = [...(wlRes.data || [])];

  console.log(`Initial state in Supabase:`);
  console.log(`- Works: ${currentWorks.length}`);
  console.log(`- Editions: ${currentEditions.length}`);
  console.log(`- LibraryItems: ${currentItems.length}`);
  console.log(`- WishlistItems: ${currentWishlist.length}\n`);

  let worksCreated = 0;
  let worksReused = 0;
  let editionsCreated = 0;
  let libraryItemsCreated = 0;
  let ignoredAlreadyExists = 0;
  let wishlistRemoved = 0;

  for (const item of batch) {
    console.log(`Processing: "${item.workTitle}" (${item.subtitle || 'Volume único'}) by ${item.workAuthor}...`);

    // 1. Check existing Work
    let existingWork = currentWorks.find(w =>
      normalizeText(w.title) === normalizeText(item.workTitle) &&
      normalizeText(w.author) === normalizeText(item.workAuthor)
    );

    let isNewWork = false;
    let workId = '';

    if (existingWork) {
      workId = existingWork.id;
      console.log(`  -> Reusing existing Work: ${workId} ("${existingWork.title}")`);
      worksReused++;
    } else {
      isNewWork = true;
      workId = `w-cloud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      console.log(`  -> Creating new Work: ${workId}`);
      worksCreated++;
      // Track locally so subsequent batch items (e.g. Vol 2) reuse it
      currentWorks.push({
        id: workId,
        user_id: userId,
        title: item.workTitle,
        original_title: null,
        author: item.workAuthor,
        original_publication_year: null
      });
    }

    // 2. Check existing Edition under this Work
    let existingEdition = currentEditions.find(e =>
      e.work_id === workId &&
      (e.publisher || '') === (item.publisher || '') &&
      (e.format || null) === (item.format || null)
    );

    let editionId = '';
    if (existingEdition) {
      editionId = existingEdition.id;
      console.log(`  -> Found existing Edition: ${editionId} (Publisher: ${existingEdition.publisher}, Format: ${existingEdition.format})`);

      // 3. Check existing LibraryItem for this Edition
      const existingItem = currentItems.find(li => li.edition_id === editionId);
      if (existingItem) {
        console.log(`  -> LibraryItem already exists (${existingItem.id}). Skipping to maintain idempotency.`);
        ignoredAlreadyExists++;
        if (isNewWork) {
          worksCreated--; // rollback counter if whole item was already there
        } else {
          worksReused--;
        }
        continue;
      }
    } else {
      editionId = `ed-cloud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    }

    const libraryItemId = `item-cloud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    // Build payload for RPC
    const coverDef = {
      type: 'generated',
      style: item.palette.style,
      primaryColor: item.palette.primaryColor,
      accentColor: item.palette.accentColor,
      textColor: item.palette.textColor,
      ...(item.palette.geometryShape ? { geometryShape: item.palette.geometryShape } : {}),
      ...(item.subtitle ? { subtitle: item.subtitle } : {})
    };

    const rpcPayload = {
      p_work: {
        id: workId,
        title: item.workTitle,
        originalTitle: null,
        author: item.workAuthor,
        originalPublicationYear: null
      },
      p_edition: {
        id: editionId,
        isbn: null,
        publisher: item.publisher,
        publicationYear: null,
        translator: null,
        language: null,
        pages: null,
        format: item.format,
        cover: coverDef,
        providerMeta: null
      },
      p_library_item: {
        id: libraryItemId,
        readingStatus: 'unread'
      },
      p_reading_record: null,
      p_queue_item: null
    };

    // Check wishlist removal
    if (currentWishlist.some(wl => wl.work_id === workId)) {
      wishlistRemoved++;
    }

    const { data: rpcRes, error: rpcErr } = await sb.rpc('bibliotheca_add_book', rpcPayload);
    if (rpcErr) {
      console.error(`  [ERROR] Failed to add book:`, rpcErr);
      process.exit(1);
    }

    console.log(`  -> Successfully added via RPC: Work=${workId}, Edition=${editionId}, Item=${libraryItemId}`);
    editionsCreated++;
    libraryItemsCreated++;

    currentEditions.push({
      id: editionId,
      user_id: userId,
      work_id: workId,
      publisher: item.publisher,
      format: item.format,
      isbn: null
    });
    currentItems.push({
      id: libraryItemId,
      user_id: userId,
      edition_id: editionId,
      reading_status: 'unread'
    });
  }

  console.log('\n=============================================');
  console.log('REGISTRATION SUMMARY:');
  console.log(`- Works criados: ${worksCreated}`);
  console.log(`- Works reutilizados: ${worksReused}`);
  console.log(`- Editions criadas: ${editionsCreated}`);
  console.log(`- LibraryItems criados: ${libraryItemsCreated}`);
  console.log(`- Itens ignorados por já existirem: ${ignoredAlreadyExists}`);
  console.log(`- WishlistItems removidos por aquisição: ${wishlistRemoved}`);
  console.log('=============================================\n');

  // Verification read-back
  console.log('--- Verification Read-Back from Supabase ---');
  const [vWorks, vEditions, vItems] = await Promise.all([
    sb.from('bibliotheca_works').select('*').order('created_at', { ascending: true }),
    sb.from('bibliotheca_editions').select('*').order('created_at', { ascending: true }),
    sb.from('bibliotheca_library_items').select('*').order('created_at', { ascending: true })
  ]);

  console.log(`Total Works in Supabase for user: ${vWorks.data.length}`);
  console.log(`Total Editions in Supabase for user: ${vEditions.data.length}`);
  console.log(`Total LibraryItems in Supabase for user: ${vItems.data.length}`);

  console.log('\nAll registered books in user catalog:');
  vItems.data.forEach((item, idx) => {
    const edition = vEditions.data.find(e => e.id === item.edition_id);
    const work = vWorks.data.find(w => w.id === edition?.work_id);
    console.log(`${idx + 1}. [${item.reading_status}] "${work?.title}" by ${work?.author} (Ed: ${edition?.publisher || 'N/A'}, Format: ${edition?.format || 'N/A'}, Cover Subtitle: ${edition?.cover?.subtitle || 'N/A'})`);
  });
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
