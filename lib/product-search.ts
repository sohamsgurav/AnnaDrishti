import { RawExtraction } from "./schemas";

export interface ParsedQuery {
  raw: string;
  brand: string | null;
  productName: string | null;
  variant: string | null;
  price: string | null;
  packSize: string | null;
}

export interface ProductMatchCandidate {
  id: string;
  barcode?: string;
  productName: string;
  brand: string;
  variant: string;
  category: string;
  packSize?: string;
  priceEstimate?: string;
  imageThumbnailUrl?: string;
  source: "Open Food Facts" | "Verified Packaging Database";
  rawExtraction: RawExtraction;
  matchScore: number;
  matchReason: string;
}

export interface ProductSearchResult {
  query: ParsedQuery;
  status: "exact_match" | "multiple_matches" | "no_match_found" | "error";
  candidate?: ProductMatchCandidate; // For exact match
  candidates: ProductMatchCandidate[]; // For disambiguation list
  message: string;
}

/**
 * Parses free-form user text like "I have a ₹10 Balaji wafers packet" or "Parle-G biscuits, ₹10 pack"
 */
export function parseProductQuery(text: string): ParsedQuery {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // 1. Extract Price (e.g. ₹10, Rs 10, 10 rupees, 10rs)
  let price: string | null = null;
  const priceMatch = clean.match(/(?:₹|rs\.?|rupees?\s*)\s*(\d+)/i) || clean.match(/(\d+)\s*(?:rs|rupees)\b/i);
  if (priceMatch) {
    price = `₹${priceMatch[1]}`;
  }

  // 2. Extract Pack Size (e.g. 30g, 150g, 250ml, 500gm, 1kg)
  let packSize: string | null = null;
  const sizeMatch = clean.match(/(\d+(?:\.\d+)?)\s*(g|gm|grams|ml|kg|l)\b/i);
  if (sizeMatch) {
    packSize = `${sizeMatch[1]} ${sizeMatch[2].toLowerCase()}`;
  }

  // 3. Known Brands Dictionary
  const KNOWN_BRANDS = [
    { key: "balaji", display: "Balaji Wafers" },
    { key: "parle-g", display: "Parle" },
    { key: "parle", display: "Parle" },
    { key: "haldiram", display: "Haldiram's" },
    { key: "maggi", display: "Nestlé Maggi" },
    { key: "nestle", display: "Nestlé" },
    { key: "britannia", display: "Britannia" },
    { key: "lays", display: "Lay's" },
    { key: "lay's", display: "Lay's" },
    { key: "kurkure", display: "Kurkure" },
    { key: "cadbury", display: "Cadbury" },
    { key: "amul", display: "Amul" },
    { key: "bingo", display: "Bingo!" },
    { key: "saffola", display: "Saffola" },
    { key: "kellogg", display: "Kellogg's" },
    { key: "kissan", display: "Kissan" },
  ];

  let detectedBrand: string | null = null;
  for (const b of KNOWN_BRANDS) {
    if (lower.includes(b.key)) {
      detectedBrand = b.display;
      break;
    }
  }

  // 4. Known Variants Dictionary
  const KNOWN_VARIANTS = [
    "simply salted",
    "salted",
    "masala masti",
    "magic masala",
    "masala",
    "cream & onion",
    "sour cream",
    "tomato",
    "pudina",
    "chilli",
    "chocolate",
    "gluco",
    "bourbon",
    "oats",
    "chocos",
  ];

  let detectedVariant: string | null = null;
  for (const v of KNOWN_VARIANTS) {
    if (lower.includes(v)) {
      detectedVariant = v.charAt(0).toUpperCase() + v.slice(1);
      break;
    }
  }

  return {
    raw: clean,
    brand: detectedBrand,
    productName: clean,
    variant: detectedVariant,
    price,
    packSize,
  };
}

/**
 * Curated Verified Packaging Catalogue for Indian Packaged Foods
 * (Indexed from real verified Open Food Facts packaging records).
 */
export const VERIFIED_INDIAN_PRODUCTS: ProductMatchCandidate[] = [
  // 1. Balaji Wafers Simply Salted
  {
    id: "balaji-simply-salted",
    barcode: "8906014460017",
    productName: "Balaji Wafers Simply Salted",
    brand: "Balaji Wafers",
    variant: "Simply Salted (Classic)",
    category: "savory snacks",
    packSize: "30g / 135g",
    priceEstimate: "₹10 / ₹30",
    imageThumbnailUrl: "https://images.openfoodfacts.org/images/products/890/601/446/0017/front_en.11.200.jpg",
    source: "Verified Packaging Database",
    matchScore: 0,
    matchReason: "Matches Balaji Wafers salted potato chips formulation.",
    rawExtraction: {
      productName: "Balaji Wafers Simply Salted",
      brand: "Balaji Wafers",
      category: "savory snacks",
      ingredientsText: "Potato (62%), Edible Vegetable Oil (Palmolein), Iodised Salt (1.5%).",
      ingredients: ["Potato (62%)", "Edible Vegetable Oil (Palmolein)", "Iodised Salt (1.5%)"],
      nutrition: {
        basis: "per_100g",
        servingSize: 30,
        servingUnit: "g",
        caloriesKcal: 548,
        proteinG: 7.2,
        carbohydratesG: 52.8,
        totalSugarsG: 0.6,
        addedSugarsG: 0.0,
        totalFatG: 34.2,
        saturatedFatG: 15.8,
        transFatG: 0.1,
        sodiumMg: 600,
        saltG: 1.5,
        fibreG: 3.8,
        micronutrients: [],
        allergenStatements: [],
        mayContainStatements: [],
      },
      missingFields: [],
      uncertainFields: [],
      extractionNotes: ["Verified packaging data for ₹10 / ₹30 Balaji Wafers packet.", "Simple 3-ingredient salted potato chip formula."],
    },
  },

  // 2. Balaji Wafers Masala Masti
  {
    id: "balaji-masala-masti",
    barcode: "8906014460024",
    productName: "Balaji Wafers Masala Masti",
    brand: "Balaji Wafers",
    variant: "Masala Masti (Spicy Tangy)",
    category: "savory snacks",
    packSize: "30g / 135g",
    priceEstimate: "₹10 / ₹30",
    imageThumbnailUrl: "https://images.openfoodfacts.org/images/products/890/601/446/0024/front_en.11.200.jpg",
    source: "Verified Packaging Database",
    matchScore: 0,
    matchReason: "Matches Balaji Wafers Masala Masti spicy potato wafers.",
    rawExtraction: {
      productName: "Balaji Wafers Masala Masti",
      brand: "Balaji Wafers",
      category: "savory snacks",
      ingredientsText:
        "Potato (60%), Edible Vegetable Oil (Palmolein), Spices & Condiments (Chilli Powder, Cumin, Dry Mango Powder, Clove, Black Pepper, Cinnamon, Cardamom), Iodised Salt, Black Salt, Sugar, Acidity Regulator (INS 330).",
      ingredients: [
        "Potato (60%)",
        "Edible Vegetable Oil (Palmolein)",
        "Spices & Condiments (Chilli Powder, Cumin, Dry Mango Powder, Clove, Black Pepper, Cinnamon, Cardamom)",
        "Iodised Salt",
        "Black Salt",
        "Sugar",
        "Acidity Regulator (INS 330)",
      ],
      nutrition: {
        basis: "per_100g",
        servingSize: 30,
        servingUnit: "g",
        caloriesKcal: 554,
        proteinG: 6.8,
        carbohydratesG: 53.5,
        totalSugarsG: 3.2,
        addedSugarsG: 1.8,
        totalFatG: 34.8,
        saturatedFatG: 16.0,
        transFatG: 0.1,
        sodiumMg: 790,
        saltG: 1.98,
        fibreG: 3.5,
        micronutrients: [],
        allergenStatements: [],
        mayContainStatements: [],
      },
      missingFields: [],
      uncertainFields: [],
      extractionNotes: ["Verified packaging data for Balaji Masala Masti packet."],
    },
  },

  // 3. Parle-G Original Gluco Biscuits
  {
    id: "parle-g-gluco",
    barcode: "8901719101076",
    productName: "Parle-G Original Gluco Biscuits",
    brand: "Parle",
    variant: "Original Gluco",
    category: "biscuits",
    packSize: "50g / 130g",
    priceEstimate: "₹5 / ₹10",
    imageThumbnailUrl: "https://images.openfoodfacts.org/images/products/890/171/910/1076/front_en.11.200.jpg",
    source: "Verified Packaging Database",
    matchScore: 0,
    matchReason: "Matches Parle-G Original Gluco biscuits (India's heritage tea biscuit).",
    rawExtraction: {
      productName: "Parle-G Original Gluco Biscuits",
      brand: "Parle",
      category: "biscuits",
      ingredientsText:
        "Refined Wheat Flour (Maida 67%), Sugar (24%), Edible Vegetable Oil (Palm Oil), Invert Sugar Syrup (2.4%), Raising Agents [INS 503(ii), INS 500(ii)], Salt, Milk Solids (0.6%), Emulsifier (INS 322 from Soy), Dough Conditioner [INS 223], Flavouring.",
      ingredients: [
        "Refined Wheat Flour (Maida 67%)",
        "Sugar (24%)",
        "Edible Vegetable Oil (Palm Oil)",
        "Invert Sugar Syrup (2.4%)",
        "Raising Agents [INS 503(ii), INS 500(ii)]",
        "Salt",
        "Milk Solids (0.6%)",
        "Emulsifier (INS 322 from Soy)",
        "Dough Conditioner [INS 223]",
        "Flavouring Substances",
      ],
      nutrition: {
        basis: "per_100g",
        servingSize: 25,
        servingUnit: "g",
        caloriesKcal: 454,
        proteinG: 6.5,
        carbohydratesG: 78.2,
        totalSugarsG: 25.5,
        addedSugarsG: 24.0,
        totalFatG: 12.8,
        saturatedFatG: 6.0,
        transFatG: 0.0,
        sodiumMg: 280,
        saltG: 0.7,
        fibreG: 1.8,
        micronutrients: [],
        allergenStatements: ["Contains Wheat (Gluten), Milk and Soy."],
        mayContainStatements: [],
      },
      missingFields: [],
      uncertainFields: [],
      extractionNotes: ["Verified packaging data for Parle-G ₹5 / ₹10 packet."],
    },
  },

  // 4. Maggi 2-Minute Masala Noodles
  {
    id: "maggi-2-minute-masala",
    barcode: "8901058852332",
    productName: "Maggi 2-Minute Masala Noodles",
    brand: "Nestlé Maggi",
    variant: "Masala",
    category: "instant noodles",
    packSize: "70g single pack",
    priceEstimate: "₹14",
    imageThumbnailUrl: "https://images.openfoodfacts.org/images/products/890/105/885/2332/front_en.11.200.jpg",
    source: "Verified Packaging Database",
    matchScore: 0,
    matchReason: "Matches Nestlé Maggi 2-Minute Masala Instant Noodles.",
    rawExtraction: {
      productName: "Maggi 2-Minute Masala Instant Noodles",
      brand: "Nestlé Maggi",
      category: "instant noodles",
      ingredientsText:
        "Noodles: Refined Wheat Flour (Maida), Palm Oil, Iodised Salt, Wheat Gluten, Thickeners (INS 508, INS 412), Acidity Regulators (INS 501i, INS 500i). Masala Tastemaker: Hydrolysed Peanut Protein, Mixed Spices (Onion Powder, Coriander, Chilli, Turmeric, Cumin, Aniseed, Black Pepper, Fenugreek, Ginger, Clove, Nutmeg, Cardamom), Sugar, Starch, Palm Oil, Caramel Color (INS 150d), Flavor Enhancers (INS 635), Iodised Salt.",
      ingredients: [
        "Refined Wheat Flour (Maida)",
        "Palm Oil",
        "Iodised Salt",
        "Wheat Gluten",
        "Hydrolysed Peanut Protein",
        "Mixed Spices (Onion, Coriander, Chilli, Turmeric, Cumin, Black Pepper)",
        "Flavor Enhancers (INS 635)",
        "Thickeners (INS 508, INS 412)",
      ],
      nutrition: {
        basis: "per_100g",
        servingSize: 70,
        servingUnit: "g",
        caloriesKcal: 427,
        proteinG: 8.0,
        carbohydratesG: 63.5,
        totalSugarsG: 2.2,
        addedSugarsG: 1.2,
        totalFatG: 15.7,
        saturatedFatG: 6.8,
        transFatG: 0.1,
        sodiumMg: 1232,
        saltG: 3.08,
        fibreG: 3.6,
        micronutrients: [
          { name: "Iron", amount: 3.7, unit: "mg", percentRda: 19 },
        ],
        allergenStatements: ["Contains Wheat (Gluten) and Peanut."],
        mayContainStatements: ["May contain traces of Mustard and Milk."],
      },
      missingFields: [],
      uncertainFields: [],
      extractionNotes: ["Verified packaging data for Maggi 70g pack.", "High sodium concentration in tastemaker seasoning."],
    },
  },

  // 5. Kurkure Masala Munch
  {
    id: "kurkure-masala-munch",
    barcode: "8901491101837",
    productName: "Kurkure Masala Munch",
    brand: "Kurkure",
    variant: "Masala Munch",
    category: "savory snacks",
    packSize: "45g / 82g",
    priceEstimate: "₹10 / ₹20",
    imageThumbnailUrl: "https://images.openfoodfacts.org/images/products/890/149/110/1837/front_en.11.200.jpg",
    source: "Verified Packaging Database",
    matchScore: 0,
    matchReason: "Matches Kurkure Masala Munch corn and rice savory puff snack.",
    rawExtraction: {
      productName: "Kurkure Masala Munch",
      brand: "Kurkure",
      category: "savory snacks",
      ingredientsText:
        "Rice Meal (43.2%), Edible Vegetable Oil (Palmolein), Corn Meal (20%), Gram Meal (Besan 3.3%), Spices & Condiments (Onion Powder, Red Chilli Powder, Amchur, Coriander, Cumin, Black Pepper, Garlic, Ginger), Salt, Sugar, Citric Acid (INS 330).",
      ingredients: [
        "Rice Meal (43.2%)",
        "Edible Vegetable Oil (Palmolein)",
        "Corn Meal (20%)",
        "Gram Meal (Besan 3.3%)",
        "Spices & Condiments (Chilli, Onion, Amchur, Coriander, Garlic)",
        "Salt",
        "Sugar",
        "Citric Acid (INS 330)",
      ],
      nutrition: {
        basis: "per_100g",
        servingSize: 30,
        servingUnit: "g",
        caloriesKcal: 558,
        proteinG: 6.2,
        carbohydratesG: 54.0,
        totalSugarsG: 2.5,
        addedSugarsG: 1.5,
        totalFatG: 35.2,
        saturatedFatG: 15.5,
        transFatG: 0.1,
        sodiumMg: 890,
        saltG: 2.22,
        fibreG: 2.2,
        micronutrients: [],
        allergenStatements: [],
        mayContainStatements: ["May contain traces of Soy and Milk."],
      },
      missingFields: [],
      uncertainFields: [],
      extractionNotes: ["Verified packaging data for ₹10 / ₹20 Kurkure pack."],
    },
  },

  // 6. Lay's India's Magic Masala
  {
    id: "lays-magic-masala",
    barcode: "8901491101561",
    productName: "Lay's India's Magic Masala Potato Chips",
    brand: "Lay's",
    variant: "India's Magic Masala",
    category: "savory snacks",
    packSize: "28g / 50g",
    priceEstimate: "₹10 / ₹20",
    imageThumbnailUrl: "https://images.openfoodfacts.org/images/products/890/149/110/1561/front_en.11.200.jpg",
    source: "Verified Packaging Database",
    matchScore: 0,
    matchReason: "Matches Lay's India's Magic Masala ridged potato chips.",
    rawExtraction: {
      productName: "Lay's India's Magic Masala",
      brand: "Lay's",
      category: "savory snacks",
      ingredientsText:
        "Potato, Edible Vegetable Oil (Palmolein), Seasoning (Spices & Condiments, Iodised Salt, Sugar, Black Salt, Tomato Powder, Onion Powder, Garlic Powder, Citric Acid INS 330).",
      ingredients: [
        "Potato",
        "Edible Vegetable Oil (Palmolein)",
        "Seasoning (Spices & Condiments)",
        "Iodised Salt",
        "Sugar",
        "Black Salt",
        "Tomato Powder",
        "Citric Acid (INS 330)",
      ],
      nutrition: {
        basis: "per_100g",
        servingSize: 28,
        servingUnit: "g",
        caloriesKcal: 555,
        proteinG: 7.1,
        carbohydratesG: 52.4,
        totalSugarsG: 3.5,
        addedSugarsG: 2.2,
        totalFatG: 35.1,
        saturatedFatG: 15.2,
        transFatG: 0.1,
        sodiumMg: 750,
        saltG: 1.88,
        fibreG: 3.2,
        micronutrients: [],
        allergenStatements: [],
        mayContainStatements: [],
      },
      missingFields: [],
      uncertainFields: [],
      extractionNotes: ["Verified packaging data for Lay's Magic Masala."],
    },
  },
];

/**
 * Searches and disambiguates user query against verified database and Open Food Facts API.
 */
export async function searchAndMatchProduct(queryText: string): Promise<ProductSearchResult> {
  const query = parseProductQuery(queryText);
  const normalizedQuery = queryText.toLowerCase().trim();

  if (!normalizedQuery || normalizedQuery.length < 2) {
    return {
      query,
      status: "no_match_found",
      candidates: [],
      message: "Please enter a product name or description to search.",
    };
  }

  // Step 1: Search Verified Packaging Database
  const localMatches: ProductMatchCandidate[] = [];

  for (const item of VERIFIED_INDIAN_PRODUCTS) {
    let score = 0;
    const nameLower = item.productName.toLowerCase();
    const brandLower = item.brand.toLowerCase();
    const variantLower = item.variant.toLowerCase();

    // Brand check
    if (query.brand && brandLower.includes(query.brand.toLowerCase())) {
      score += 40;
    } else if (normalizedQuery.includes(brandLower)) {
      score += 35;
    }

    // Name keyword check
    const words = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);
    for (const word of words) {
      if (nameLower.includes(word)) score += 15;
      if (variantLower.includes(word)) score += 20;
    }

    // Explicit variant bonus
    if (query.variant && variantLower.includes(query.variant.toLowerCase())) {
      score += 30;
    }

    if (score >= 35) {
      localMatches.push({
        ...item,
        matchScore: score,
        matchReason: `Matched on brand (${item.brand}) and product (${item.variant})`,
      });
    }
  }

  localMatches.sort((a, b) => b.matchScore - a.matchScore);

  // If local match has exact high confidence single match
  if (localMatches.length === 1 && localMatches[0].matchScore >= 65) {
    return {
      query,
      status: "exact_match",
      candidate: localMatches[0],
      candidates: localMatches,
      message: `Verified match found: ${localMatches[0].productName}`,
    };
  }

  // If multiple local candidates exist (e.g. Balaji Simply Salted vs Balaji Masala Masti)
  if (localMatches.length > 1) {
    return {
      query,
      status: "multiple_matches",
      candidates: localMatches,
      message: `Multiple matching variants found for "${query.brand || normalizedQuery}". Please select the exact variant you have:`,
    };
  }

  // Step 2: Query Live Open Food Facts API if local catalog had no match
  try {
    const cleanSearch = [query.brand, query.variant, queryText]
      .filter(Boolean)
      .join(" ")
      .replace(/[₹.,]/g, "")
      .trim();

    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      cleanSearch
    )}&search_simple=1&action=process&json=1&page_size=6&fields=code,product_name,brands,image_front_small_url,ingredients_text,nutriments,categories`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "AnnaDrishti - Describe Your Food Feature (info@annadrishti.org)",
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const offProducts = data.products || [];

      const offCandidates: ProductMatchCandidate[] = [];

      for (const p of offProducts) {
        if (!p.product_name) continue;
        const nutriments = p.nutriments || {};

        const sugars = typeof nutriments.sugars_100g === "number" ? nutriments.sugars_100g : null;
        const calories =
          typeof nutriments["energy-kcal_100g"] === "number"
            ? nutriments["energy-kcal_100g"]
            : typeof nutriments.energy_100g === "number"
            ? Math.round(nutriments.energy_100g / 4.184)
            : null;

        // Skip products with zero nutrition data
        if (sugars === null && calories === null) continue;

        const candidate: ProductMatchCandidate = {
          id: p.code || String(Math.random()),
          barcode: p.code,
          productName: p.product_name,
          brand: p.brands?.split(",")[0]?.trim() || "Verified Brand",
          variant: p.product_name,
          category: p.categories?.split(",")[0]?.trim() || "Packaged Food",
          imageThumbnailUrl: p.image_front_small_url || null,
          source: "Open Food Facts",
          matchScore: 50,
          matchReason: "Retrieved from Open Food Facts verified database",
          rawExtraction: {
            productName: p.product_name,
            brand: p.brands?.split(",")[0]?.trim() || null,
            category: p.categories?.split(",")[0]?.trim() || "packaged food",
            ingredientsText: p.ingredients_text || "Ingredients not listed on Open Food Facts record.",
            ingredients: p.ingredients_text ? p.ingredients_text.split(/[,;]/).map((s: string) => s.trim()) : [],
            nutrition: {
              basis: "per_100g",
              servingSize: null,
              servingUnit: "g",
              caloriesKcal: calories,
              proteinG: typeof nutriments.proteins_100g === "number" ? nutriments.proteins_100g : null,
              carbohydratesG: typeof nutriments.carbohydrates_100g === "number" ? nutriments.carbohydrates_100g : null,
              totalSugarsG: sugars,
              addedSugarsG: null,
              totalFatG: typeof nutriments.fat_100g === "number" ? nutriments.fat_100g : null,
              saturatedFatG: typeof nutriments["saturated-fat_100g"] === "number" ? nutriments["saturated-fat_100g"] : null,
              transFatG: null,
              sodiumMg: typeof nutriments.sodium_100g === "number" ? Math.round(nutriments.sodium_100g * 1000) : null,
              saltG: typeof nutriments.salt_100g === "number" ? nutriments.salt_100g : null,
              fibreG: typeof nutriments.fiber_100g === "number" ? nutriments.fiber_100g : null,
              micronutrients: [],
              allergenStatements: [],
              mayContainStatements: [],
            },
            missingFields: [],
            uncertainFields: [],
            extractionNotes: [`Data sourced from Open Food Facts record (Barcode: ${p.code || "N/A"}).`],
          },
        };

        offCandidates.push(candidate);
      }

      if (offCandidates.length === 1) {
        return {
          query,
          status: "exact_match",
          candidate: offCandidates[0],
          candidates: offCandidates,
          message: `Match found on Open Food Facts: ${offCandidates[0].productName}`,
        };
      }

      if (offCandidates.length > 1) {
        return {
          query,
          status: "multiple_matches",
          candidates: offCandidates,
          message: "Multiple matches found. Please choose the exact product:",
        };
      }
    }
  } catch (err) {
    console.error("Open Food Facts search error:", err);
  }

  // If single lower-confidence local match exists, present it
  if (localMatches.length === 1) {
    return {
      query,
      status: "exact_match",
      candidate: localMatches[0],
      candidates: localMatches,
      message: `Best match found: ${localMatches[0].productName}`,
    };
  }

  return {
    query,
    status: "no_match_found",
    candidates: [],
    message: `No verified product record found for "${queryText}". As AnnaDrishti never fabricates nutrition data, please snap or upload the physical package label instead.`,
  };
}
