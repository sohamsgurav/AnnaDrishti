// Comprehensive Unit & Security Test Suite for AnnaDrishti
import assert from "assert";

console.log("==================================================");
console.log("   AnnaDrishti Core & Security Test Suite         ");
console.log("==================================================\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

// ----------------------------------------------------
// 1. Units & Salt Normalization Tests
// ----------------------------------------------------
import { saltToSodiumMg, sodiumMgToSaltG, normalizeNutritionData } from "../lib/units.js";

test("saltToSodiumMg calculates accurate sodium from salt", () => {
  assert.strictEqual(saltToSodiumMg(2.5), 1000);
  assert.strictEqual(saltToSodiumMg(0), 0);
  assert.strictEqual(saltToSodiumMg(null), null);
});

test("sodiumMgToSaltG calculates accurate salt from sodium", () => {
  assert.strictEqual(sodiumMgToSaltG(1000), 2.5);
  assert.strictEqual(sodiumMgToSaltG(null), null);
});

test("normalizeNutritionData preserves null without guessing 0", () => {
  const raw = {
    basis: "per_100g",
    caloriesKcal: 450,
    proteinG: 8,
    carbohydratesG: 60,
    totalSugarsG: null, // Missing field!
    addedSugarsG: null,
    totalFatG: 20,
    saturatedFatG: null,
    transFatG: null,
    sodiumMg: 400,
    saltG: null,
    fibreG: null,
    micronutrients: [],
    allergenStatements: [],
    mayContainStatements: [],
  };

  const normalized = normalizeNutritionData(raw);
  assert.strictEqual(normalized.per100g.totalSugarsG, null);
  assert.strictEqual(normalized.per100g.fibreG, null);
  assert.ok(normalized.missingFields.includes("totalSugarsG"));
  assert.ok(normalized.missingFields.includes("fibreG"));
});

// ----------------------------------------------------
// 2. Restriction Matching Tests
// ----------------------------------------------------
import { checkRestrictions } from "../lib/restrictions.js";

test("checkRestrictions flags direct allergen ingredient match", () => {
  const selected = ["peanut", "milk"];
  const ingredients = ["wheat flour", "sugar", "roasted peanuts (10%)", "vegetable oil"];
  const allergenStmts = ["Contains Wheat, Peanut"];
  const mayContain = [];

  const results = checkRestrictions(selected, ingredients, allergenStmts, mayContain);
  const peanutCheck = results.find((r) => r.id === "peanut");
  const milkCheck = results.find((r) => r.id === "milk");

  assert.ok(peanutCheck);
  assert.strictEqual(peanutCheck.status, "match");
  assert.strictEqual(peanutCheck.isDirectIngredient, true);

  assert.ok(milkCheck);
  assert.strictEqual(milkCheck.status, "no_match_detected");
});

test("checkRestrictions keeps 'may contain' distinct from direct match", () => {
  const selected = ["milk"];
  const ingredients = ["wheat flour", "sugar", "cocoa solids", "palm oil"];
  const allergenStmts = ["Contains Gluten"];
  const mayContain = ["May contain traces of milk and tree nuts"];

  const results = checkRestrictions(selected, ingredients, allergenStmts, mayContain);
  const milkCheck = results.find((r) => r.id === "milk");

  assert.ok(milkCheck);
  assert.strictEqual(milkCheck.status, "may_contain_match");
  assert.strictEqual(milkCheck.isDirectIngredient, false);
  assert.strictEqual(milkCheck.isMayContain, true);
});

// ----------------------------------------------------
// 3. Product Rating (AnnaDrishti Index v1.0) Tests
// ----------------------------------------------------
import { calculateProductRating } from "../lib/rating.js";

test("calculateProductRating yields high score for healthy whole foods", () => {
  const healthyFood = {
    caloriesKcal: 380,
    proteinG: 14, // High protein bonus (+10)
    carbohydratesG: 60,
    totalSugarsG: 1, // Low sugar bonus (+8)
    addedSugarsG: 0,
    totalFatG: 6,
    saturatedFatG: 1.0, // Low sat fat bonus (+8)
    transFatG: 0,
    cholesterolMg: 0,
    sodiumMg: 50, // Low sodium bonus (+7)
    saltG: 0.12,
    fibreG: 11, // High fibre bonus (+12)
    micronutrients: [],
  };

  const rating = calculateProductRating(healthyFood, []);
  assert.strictEqual(rating.band, "green");
  assert.ok(rating.score >= 80);
});

test("calculateProductRating penalizes high sugar, sodium, and trans fats", () => {
  const unhealthySnack = {
    caloriesKcal: 560,
    proteinG: 4,
    carbohydratesG: 60,
    totalSugarsG: 35, // Penalty: -20
    addedSugarsG: 30,
    totalFatG: 35,
    saturatedFatG: 16, // Penalty: -15
    transFatG: 0.8, // Penalty: -15
    cholesterolMg: 0,
    sodiumMg: 1100, // Penalty: -20
    saltG: 2.75,
    fibreG: 1,
    micronutrients: [],
  };

  const rating = calculateProductRating(unhealthySnack, []);
  assert.strictEqual(rating.band, "red");
  assert.ok(rating.score <= 40);
});

// ----------------------------------------------------
// 4. Product Query Parser Tests ("Describe Your Food")
// ----------------------------------------------------
import { parseProductQuery } from "../lib/product-search.js";

test("parseProductQuery extracts brand, price, and variant correctly", () => {
  const q1 = parseProductQuery("I have a ₹10 Balaji wafers packet");
  assert.strictEqual(q1.brand, "Balaji Wafers");
  assert.strictEqual(q1.price, "₹10");

  const q2 = parseProductQuery("Parle-G biscuits, ₹10 pack");
  assert.strictEqual(q2.brand, "Parle");
  assert.strictEqual(q2.price, "₹10");

  const q3 = parseProductQuery("Maggi 2-Minute Noodles, masala flavour 70g");
  assert.strictEqual(q3.brand, "Nestlé Maggi");
  assert.strictEqual(q3.packSize, "70 g");
  assert.strictEqual(q3.variant, "Masala");
});

// ----------------------------------------------------
// 5. Security & Rate Limiting Tests
// ----------------------------------------------------
import { sanitizeInput, checkRateLimit } from "../lib/security.js";

test("sanitizeInput strips dangerous XSS tags & entities", () => {
  const malicious = "<script>alert('pwned')</script>Hello <b>World</b>";
  const sanitized = sanitizeInput(malicious);
  assert.ok(!sanitized.includes("<script>"));
  assert.ok(!sanitized.includes("</script>"));
});

test("checkRateLimit tracks and permits valid client requests", () => {
  const res = checkRateLimit("test-client-ip-1");
  assert.strictEqual(res.allowed, true);
  assert.ok(res.remaining > 0);
});

// ----------------------------------------------------
// 6. Efficiency & Caching Tests
// ----------------------------------------------------
import { memoryCache } from "../lib/cache.js";

test("memoryCache generates deterministic SHA-256 hash", () => {
  const hash1 = memoryCache.generateHash("image-base64-payload-sample");
  const hash2 = memoryCache.generateHash("image-base64-payload-sample");
  assert.strictEqual(hash1, hash2);
  assert.strictEqual(hash1.length, 64);
});

console.log("\n==================================================");
console.log(` Test Results: ${passed} Passed, ${failed} Failed`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
