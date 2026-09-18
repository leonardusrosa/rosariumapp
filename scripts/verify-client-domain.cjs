const {
  hasMeaningfulLocalData,
  getUserCloudCacheKey,
  EMPTY_STATE,
  DEMO_STATE,
} = require('../client/src/contexts/bibliothecaStateStorage');

console.log('=== VERIFYING CLIENT DOMAIN & CACHE RULES ===\n');

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

// 1. Fresh production browser starts empty and does not prompt import
assert(EMPTY_STATE.works.length === 0, 'EMPTY_STATE has 0 works');
assert(hasMeaningfulLocalData(EMPTY_STATE) === false, 'Fresh empty browser does NOT offer import');

// 2. Prototype demo fixtures alone do not trigger import prompt
assert(hasMeaningfulLocalData(DEMO_STATE) === false, 'Static prototype demo fixtures do NOT offer import');

// 3. User with user-created work triggers import prompt
const stateWithUserWork = {
  ...EMPTY_STATE,
  works: [{ id: 'w-custom-1', title: 'Meu Livro Personalizado', author: 'Autor Pessoal' }],
  editions: [{ id: 'ed-custom-1', workId: 'w-custom-1', cover: { type: 'generated' } }],
  libraryItems: [{ id: 'item-custom-1', editionId: 'ed-custom-1', readingStatus: 'reading' }],
};
assert(hasMeaningfulLocalData(stateWithUserWork) === true, 'User-created books properly detected as meaningful local data');

// 4. User with extra notes triggers import prompt
const stateWithUserNotes = {
  ...DEMO_STATE,
  notes: [
    ...DEMO_STATE.notes,
    { id: 'n-user-1', workId: 'w-1', content: 'Minha nota pessoal profunda' }
  ]
};
assert(hasMeaningfulLocalData(stateWithUserNotes) === true, 'Personal notes on books properly detected as meaningful local data');

// 5. User cache isolation: User A cache key !== User B cache key
const keyA = getUserCloudCacheKey('user-alpha-uuid');
const keyB = getUserCloudCacheKey('user-beta-uuid');
assert(keyA !== keyB, 'User A cache key is distinct from User B cache key');
assert(keyA === 'bibliotheca_cloud_cache_v1:user-alpha-uuid', 'Cache key format matches specification');

console.log(`\n=================================================`);
console.log(`CLIENT RULES SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`=================================================\n`);

if (failed > 0) process.exit(1);
