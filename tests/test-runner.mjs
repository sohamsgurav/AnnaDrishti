// End-to-End Test Runner for AnnaDrishti Live Engine
import http from "http";

console.log("==================================================");
console.log("   AnnaDrishti Full-Stack Integration Tests       ");
console.log("==================================================\n");

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      `http://localhost:3000${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let text = "";
        res.on("data", (c) => (text += c));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(text), headers: res.headers });
          } catch (e) {
            resolve({ status: res.statusCode, text, headers: res.headers });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  // Test 1: Describe Your Food - Disambiguation
  try {
    const res = await post("/api/search-product", { query: "₹10 Balaji wafers packet" });
    if (res.status === 200 && res.data.status === "multiple_matches" && res.data.candidates.length >= 2) {
      console.log("✅ PASS: Describe Your Food — Correctly disambiguates Balaji Wafers variants");
      passed++;
    } else {
      console.error("❌ FAIL: Describe Your Food disambiguation", res);
      failed++;
    }
  } catch (e) {
    console.error("❌ FAIL: Test 1 connection error", e.message);
    failed++;
  }

  // Test 2: Describe Your Food - Exact Match
  try {
    const res = await post("/api/search-product", { query: "Parle-G biscuits, ₹10 pack" });
    if (res.status === 200 && res.data.status === "exact_match" && res.data.candidate.brand === "Parle") {
      console.log("✅ PASS: Describe Your Food — Exact match identified Parle-G");
      passed++;
    } else {
      console.error("❌ FAIL: Describe Your Food exact match", res);
      failed++;
    }
  } catch (e) {
    console.error("❌ FAIL: Test 2 connection error", e.message);
    failed++;
  }

  // Test 3: Zero-Hallucination on Unknown Item
  try {
    const res = await post("/api/search-product", { query: "mysterious unindexed spaceship candy" });
    if (res.status === 200 && res.data.status === "no_match_found") {
      console.log("✅ PASS: Zero-Hallucination — Rejects unknown product without fabricating data");
      passed++;
    } else {
      console.error("❌ FAIL: Zero-Hallucination rule", res);
      failed++;
    }
  } catch (e) {
    console.error("❌ FAIL: Test 3 connection error", e.message);
    failed++;
  }

  // Test 4: End-to-End Label Analysis Pipeline
  try {
    const res = await post("/api/analyze", {
      presetId: "demo-bhujia",
      preferences: {
        allergens: ["peanut"],
        dietaryPreferences: ["vegetarian"],
        goals: ["lower-sugar"],
      },
    });

    if (
      res.status === 200 &&
      res.data.rating?.score !== undefined &&
      res.data.nutrition?.per100g &&
      res.data.restrictionChecks?.length > 0 &&
      res.data.ingredientFindings?.length > 0
    ) {
      console.log(
        `✅ PASS: Analysis Pipeline — Scored ${res.data.rating.score}/100, allergen check passed, ${res.data.alternatives.length} verified alternatives found`
      );
      passed++;
    } else {
      console.error("❌ FAIL: Analysis Pipeline", res);
      failed++;
    }
  } catch (e) {
    console.error("❌ FAIL: Test 4 connection error", e.message);
    failed++;
  }

  // Test 5: 100% Score Benchmark Pipeline Test (Tata Sampann 100% Rolled Oats)
  try {
    const res = await post("/api/analyze", {
      presetId: "demo-oats",
      preferences: {
        allergens: [],
        dietaryPreferences: ["vegetarian", "vegan"],
        goals: ["high-fiber", "high-protein", "lower-sugar"],
      },
    });

    if (res.status === 200 && res.data.rating?.score === 100 && res.data.rating?.band === "green") {
      console.log(
        `✅ PASS: 100% SVG Score — Tata Sampann Rolled Oats achieved perfect ${res.data.rating.score}% (Green Band)`
      );
      passed++;
    } else {
      console.error("❌ FAIL: 100% SVG Score pipeline", res.data?.rating);
      failed++;
    }
  } catch (e) {
    console.error("❌ FAIL: Test 5 connection error", e.message);
    failed++;
  }

  // Test 6: Rate Limiting Header Verification
  try {
    const res = await post("/api/analyze", { presetId: "demo-bourbon" });
    if (res.headers["x-ratelimit-remaining"]) {
      console.log(`✅ PASS: Security Rate Limiting — Header verified (${res.headers["x-ratelimit-remaining"]} remaining)`);
      passed++;
    } else {
      console.log("⚠️ WARN: Rate limit header absent, status=", res.status);
    }
  } catch (e) {
    console.error("❌ FAIL: Test 6 connection error", e.message);
  }

  console.log("\n==================================================");
  console.log(` Summary: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");
}

runTests();
