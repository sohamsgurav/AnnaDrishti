import { RestrictionCheck } from "./schemas";

export interface RestrictionDefinition {
  id: string;
  label: string;
  type: "allergen" | "dietary_preference";
  description: string;
  keywords: string[];
  nonKeywords?: string[]; // phrases that might cause false positives
}

export const SUPPORTED_RESTRICTIONS: RestrictionDefinition[] = [
  // Allergens
  {
    id: "peanut",
    label: "Peanut / Groundnut",
    type: "allergen",
    description: "Common severe allergen, including arachis oil & moongphali",
    keywords: ["peanut", "peanuts", "groundnut", "groundnuts", "arachis", "moongphali", "mungfali"],
  },
  {
    id: "tree_nuts",
    label: "Tree Nuts (Almond, Cashew, Walnut, etc.)",
    type: "allergen",
    description: "Almonds, cashews, walnuts, pistachios, hazelnuts, etc.",
    keywords: [
      "tree nut",
      "tree nuts",
      "almond",
      "almonds",
      "badam",
      "cashew",
      "cashews",
      "kaju",
      "walnut",
      "walnuts",
      "akhrot",
      "pistachio",
      "pistachios",
      "pista",
      "hazelnut",
      "hazelnuts",
      "pecan",
      "macadamia",
    ],
  },
  {
    id: "milk",
    label: "Milk / Dairy (Lactose & Casein)",
    type: "allergen",
    description: "Milk solids, whey, casein, lactose, ghee, butter, paneer, curd",
    keywords: [
      "milk",
      "dairy",
      "milk solids",
      "whey",
      "casein",
      "caseinate",
      "lactose",
      "butter",
      "ghee",
      "cream",
      "cheese",
      "paneer",
      "curd",
      "yogurt",
      "yoghurt",
      "milk powder",
      "smp",
      "wpc",
      "condensed milk",
    ],
  },
  {
    id: "gluten",
    label: "Gluten / Wheat",
    type: "allergen",
    description: "Wheat, maida, atta, semolina/suji, barley, rye, spelt",
    keywords: [
      "gluten",
      "wheat",
      "maida",
      "refined wheat flour",
      "atta",
      "whole wheat",
      "semolina",
      "suji",
      "sooji",
      "rava",
      "barley",
      "rye",
      "spelt",
      "malt extract",
      "maltodextrin from wheat",
    ],
  },
  {
    id: "soy",
    label: "Soy / Soya",
    type: "allergen",
    description: "Soya flour, soya lecithin, soy protein isolate, edamame, tofu",
    keywords: ["soy", "soya", "soybean", "soybeans", "soya lecithin", "soy lecithin", "tofu", "edamame", "tvp"],
  },
  {
    id: "egg",
    label: "Egg",
    type: "allergen",
    description: "Eggs, albumin, ovalbumin, egg yolk, lysozyme, egg powder",
    keywords: ["egg", "eggs", "albumin", "ovalbumin", "egg yolk", "egg white", "egg powder", "lysozyme", "e1105"],
  },
  {
    id: "fish_shellfish",
    label: "Fish & Shellfish",
    type: "allergen",
    description: "Fish, prawns, shrimp, crab, lobster, oyster, fish gelatin",
    keywords: [
      "fish",
      "prawn",
      "prawns",
      "shrimp",
      "shrimps",
      "crab",
      "lobster",
      "shellfish",
      "seafood",
      "anchovy",
      "oyster",
      "fish oil",
      "gelatin (fish)",
    ],
  },
  {
    id: "sesame",
    label: "Sesame",
    type: "allergen",
    description: "Sesame seeds, til, gingelly oil, tahini",
    keywords: ["sesame", "til", "gingelly", "tahini", "sesame oil"],
  },
  {
    id: "mustard",
    label: "Mustard",
    type: "allergen",
    description: "Mustard seeds, sarson, rai, mustard paste",
    keywords: ["mustard", "sarson", "rai", "mustard oil", "mustard seed"],
  },

  // Dietary Preferences
  {
    id: "vegetarian",
    label: "Vegetarian (Indian Standard)",
    type: "dietary_preference",
    description: "No animal flesh, poultry, seafood, or slaughter by-products like animal gelatin",
    keywords: [
      "chicken",
      "meat",
      "beef",
      "pork",
      "bacon",
      "mutton",
      "lamb",
      "fish",
      "prawn",
      "shrimp",
      "seafood",
      "gelatin",
      "gelatine",
      "animal fat",
      "lard",
      "tallow",
      "carmine",
      "cochineal",
      "ins 120",
      "e120",
      "bone char",
      "animal rennet",
    ],
  },
  {
    id: "vegan",
    label: "100% Plant-Based (Vegan)",
    type: "dietary_preference",
    description: "No animal products, including dairy, honey, eggs, or beeswax",
    keywords: [
      "chicken",
      "meat",
      "beef",
      "pork",
      "fish",
      "gelatin",
      "milk",
      "dairy",
      "whey",
      "casein",
      "butter",
      "ghee",
      "cheese",
      "paneer",
      "curd",
      "yogurt",
      "egg",
      "honey",
      "beeswax",
      "shellac",
      "ins 904",
      "carmine",
      "ins 120",
      "lactose",
    ],
  },
  {
    id: "jain",
    label: "Jain Vegetarian",
    type: "dietary_preference",
    description: "Vegetarian with zero root vegetables (onion, garlic, potato, carrot, radish)",
    keywords: [
      "chicken",
      "meat",
      "fish",
      "egg",
      "gelatin",
      "onion",
      "garlic",
      "potato",
      "potatoes",
      "carrot",
      "radish",
      "ginger",
      "beetroot",
      "mushroom",
      "pyaz",
      "lahsun",
      "aloo",
      "leek",
      "shallot",
    ],
  },
  {
    id: "low_sugar",
    label: "Low Sugar / Diabetic-Friendly",
    type: "dietary_preference",
    description: "Flag products with high added sugar, glucose syrup, or maltodextrin",
    keywords: [
      "sugar",
      "glucose",
      "high fructose corn syrup",
      "corn syrup",
      "invert sugar",
      "sucrose",
      "dextrose",
      "maltodextrin",
      "liquid glucose",
      "maltose",
    ],
  },
  {
    id: "halal",
    label: "Halal Friendly",
    type: "dietary_preference",
    description: "No pork, bacon, alcohol/ethanol, or uncertified animal gelatin",
    keywords: ["pork", "bacon", "ham", "lard", "alcohol", "ethanol", "wine", "beer", "rum", "gelatin", "carmine"],
  },
];

/**
 * Deterministically checks ingredients and allergen statements against user selected restrictions.
 */
export function checkRestrictions(
  selectedIds: string[],
  ingredientsList: string[],
  allergenStatements: string[],
  mayContainStatements: string[],
  ingredientsRawText?: string | null
): RestrictionCheck[] {
  if (!selectedIds || selectedIds.length === 0) {
    return [];
  }

  const allIngredientsCombined = [
    ...ingredientsList,
    ingredientsRawText || "",
    ...allergenStatements,
  ]
    .join(" ")
    .toLowerCase();

  const mayContainCombined = mayContainStatements.join(" ").toLowerCase();

  const results: RestrictionCheck[] = [];

  for (const id of selectedIds) {
    const def = SUPPORTED_RESTRICTIONS.find((r) => r.id === id);
    if (!def) continue;

    let matchedKeyword: string | null = null;
    let isDirect = false;
    let isMayContain = false;

    // Check direct ingredients & allergen "contains" statements
    for (const kw of def.keywords) {
      const regex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, "i");
      if (regex.test(allIngredientsCombined)) {
        matchedKeyword = kw;
        isDirect = true;
        break;
      }
    }

    // Check advisory "may contain" statements
    if (!isDirect) {
      for (const kw of def.keywords) {
        const regex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, "i");
        if (regex.test(mayContainCombined)) {
          matchedKeyword = kw;
          isMayContain = true;
          break;
        }
      }
    }

    // Also check for negation or absence of ingredient text
    if (!allIngredientsCombined.trim() && !mayContainCombined.trim()) {
      results.push({
        id: def.id,
        label: def.label,
        type: def.type,
        status: "uncertain",
        matchedText: null,
        isDirectIngredient: false,
        isMayContain: false,
        explanation: "Ingredient list is unreadable or missing from label. Unable to verify.",
      });
      continue;
    }

    if (isDirect && matchedKeyword) {
      results.push({
        id: def.id,
        label: def.label,
        type: def.type,
        status: "match",
        matchedText: matchedKeyword,
        isDirectIngredient: true,
        isMayContain: false,
        explanation: `Match detected: Label lists "${matchedKeyword}". Avoid if sensitive.`,
      });
    } else if (isMayContain && matchedKeyword) {
      results.push({
        id: def.id,
        label: def.label,
        type: def.type,
        status: "may_contain_match",
        matchedText: matchedKeyword,
        isDirectIngredient: false,
        isMayContain: true,
        explanation: `Advisory warning: Manufacturer declares "May contain ${matchedKeyword}" due to shared processing facility.`,
      });
    } else {
      results.push({
        id: def.id,
        label: def.label,
        type: def.type,
        status: "no_match_detected",
        matchedText: null,
        isDirectIngredient: false,
        isMayContain: false,
        explanation:
          "No declared match found in readable label text. (Important: Does not guarantee 100% absence; verify physical packaging).",
      });
    }
  }

  return results;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
