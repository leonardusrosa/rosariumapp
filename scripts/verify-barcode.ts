import { isBooklandIsbn13, normalizeIsbn, validateIsbn } from "../shared/bookMetadataTypes";
import { validateBooklandBarcode, BarcodeDebouncer } from "../client/src/lib/barcode/isbnValidation";

function assert(condition: boolean, description: string) {
  if (condition) {
    console.log(`[PASS] ${description}`);
  } else {
    console.error(`[FAIL] ${description}`);
    process.exitCode = 1;
  }
}

console.log("=== BIBLIOTHECA PASS 6 BARCODE LOGIC VERIFICATION ===\n");

// 1. Raw EAN normalization & Bookland validation
console.log("--- 1. Bookland EAN-13 ISBN Validation ---");

// Valid 978 Bookland ISBN (Crime and Punishment, Penguin)
assert(isBooklandIsbn13("9780140449136"), "Accepts valid clean 978-ISBN13: 9780140449136");
assert(isBooklandIsbn13("978-0-14-044913-6"), "Accepts formatted 978-ISBN13 with hyphens");
assert(isBooklandIsbn13(" 978 0140449136 "), "Accepts 978-ISBN13 with whitespace");

// Valid 978 Brazilian ISBN (Dom Casmurro)
assert(isBooklandIsbn13("9788535902778"), "Accepts valid Brazilian 978-ISBN13: 9788535902778");

// Valid 979 Bookland ISBN
assert(isBooklandIsbn13("9791090636071"), "Accepts valid 979-ISBN13: 9791090636071");
assert(isBooklandIsbn13("979-10-90636-07-1"), "Accepts formatted 979-ISBN13 with hyphens");

// Invalid checksum
assert(!isBooklandIsbn13("9780140449130"), "Rejects 978 with invalid check digit: 9780140449130");
assert(!isBooklandIsbn13("9791090636070"), "Rejects 979 with invalid check digit: 9791090636070");

// Retail non-book EAN-13 barcodes
// Brazilian retail product (e.g. coffee / beverage starting with 789)
assert(!isBooklandIsbn13("7891000100103"), "Rejects non-book retail EAN-13 (7891000100103)");
// European grocery product (e.g. 5012345678900)
assert(!isBooklandIsbn13("5012345678900"), "Rejects European retail EAN-13 (5012345678900)");
// Standard UPC-A / EAN-13 starting with 0
assert(!isBooklandIsbn13("0123456789012"), "Rejects retail code starting with 0");

// ISBN-10 should NOT be accepted as a Bookland EAN-13 barcode
assert(!isBooklandIsbn13("0140449132"), "Rejects 10-digit ISBN as barcode (barcode must be EAN-13 Bookland)");

// Random alphanumeric / corrupted codes
assert(!isBooklandIsbn13(""), "Rejects empty string");
assert(!isBooklandIsbn13("978014044913A"), "Rejects non-numeric characters");
assert(!isBooklandIsbn13("12345"), "Rejects short numeric string");

// 2. validateBooklandBarcode adapter function
console.log("\n--- 2. validateBooklandBarcode ---");
const resValid = validateBooklandBarcode("978-0-14-044913-6");
assert(resValid.isValid === true, "validateBooklandBarcode marks valid 978 as valid");
assert(resValid.normalizedIsbn === "9780140449136", "validateBooklandBarcode returns normalized clean ISBN");

const resNonBook = validateBooklandBarcode("7891000100103");
assert(resNonBook.isValid === false, "validateBooklandBarcode marks retail 789 barcode as invalid");
assert(resNonBook.normalizedIsbn === undefined, "validateBooklandBarcode yields undefined for non-book barcode");

// 3. BarcodeDebouncer behavior
console.log("\n--- 3. BarcodeDebouncer & Acceptance Semantics ---");
const debouncer = new BarcodeDebouncer(500);

// Invalid barcodes don't trigger or lock
const resInvalid = debouncer.process("7891000100103");
assert(resInvalid === null, "Debouncer ignores retail non-book barcode without locking");

// First valid barcode is accepted
const firstAccept = debouncer.process("9780140449136");
assert(firstAccept === "9780140449136", "Debouncer accepts first valid Bookland ISBN");

// Immediate repeat frame is blocked
const secondFrame = debouncer.process("9780140449136");
assert(secondFrame === null, "Debouncer suppresses duplicate frame immediately following acceptance");

// Even a different barcode is blocked once accepted (session lock until reset)
const differentBarcode = debouncer.process("9791090636071");
assert(differentBarcode === null, "Debouncer stays locked to prevent multi-triggering before navigation");

// Reset allows scanning again
debouncer.reset();
const afterReset = debouncer.process("9791090636071");
assert(afterReset === "9791090636071", "Debouncer accepts new ISBN after reset()");

console.log("\n=== ALL BARCODE UNIT TESTS COMPLETE ===");
