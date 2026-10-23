import { IngredientFinding } from "./schemas";

export interface CuratedIngredientRecord {
  aliases: string[];
  cleanName: string;
  insNumber?: string;
  purpose: string;
  category: IngredientFinding["category"];
  evidenceSummary: string;
  context: string;
  severity: IngredientFinding["severity"];
  source: string;
}

export const INGREDIENTS_DATABASE: CuratedIngredientRecord[] = [
  // Sweeteners & Syrups
  {
    aliases: ["sugar", "refined sugar", "sucrose", "cane sugar", "table sugar"],
    cleanName: "Refined Sugar (Sucrose)",
    purpose: "Sweetener, bulking agent & preservative",
    category: "sweetener",
    evidenceSummary: "Caloric simple carbohydrate. Excessive consumption contributes to dental caries, weight gain, and insulin resistance.",
    context: "WHO & ICMR recommend limiting added free sugars to under 25g/day (<5% of daily energy).",
    severity: "watch",
    source: "WHO Dietary Guidelines & ICMR-NIN 2020",
  },
  {
    aliases: ["liquid glucose", "glucose syrup", "corn syrup", "high fructose corn syrup", "hfcs"],
    cleanName: "Liquid Glucose / Corn Syrup",
    purpose: "Humectant, sweetener & anti-crystallizing agent",
    category: "sweetener",
    evidenceSummary: "Rapidly absorbed high-glycemic syrup. Spikes blood glucose and triggers rapid insulin response.",
    context: "Frequently used in confectioneries and jams to maintain smooth texture. Frequent intake increases cardiometabolic risk.",
    severity: "watch",
    source: "FSSAI Food Safety Standards & Lancet Diabetes",
  },
  {
    aliases: ["invert sugar", "invert sugar syrup"],
    cleanName: "Invert Sugar Syrup",
    purpose: "Sweetener & moisture-retaining agent",
    category: "sweetener",
    evidenceSummary: "Split mixture of glucose and fructose. Slightly sweeter than regular sucrose with similar caloric impact.",
    context: "Commonly used in biscuits and baked foods for tenderness and browning.",
    severity: "watch",
    source: "Codex Alimentarius Standard for Sugars",
  },
  {
    aliases: ["maltodextrin"],
    cleanName: "Maltodextrin",
    purpose: "Bulking agent, carrier & texture modifier",
    category: "sweetener",
    evidenceSummary: "Digested rapidly like glucose with a very high Glycemic Index (GI 85–105). Can cause sharp post-meal blood sugar surges.",
    context: "Safe in culinary amounts; people with diabetes or prediabetes should monitor foods where maltodextrin is a top-3 ingredient.",
    severity: "watch",
    source: "European Journal of Clinical Nutrition / FSSAI",
  },
  {
    aliases: ["sucralose", "ins 955", "e955"],
    cleanName: "Sucralose (INS 955)",
    insNumber: "INS 955",
    purpose: "Non-nutritive high-intensity sweetener (600x sweeter than sugar)",
    category: "sweetener",
    evidenceSummary: "Zero-calorie chlorinated carbohydrate sweetener. Approved by FSSAI, US FDA, and EFSA as safe within Acceptable Daily Intake (ADI 15 mg/kg bw).",
    context: "Emerging gut microbiome research suggests moderate consumption; useful for calorie reduction when replacing high sugar.",
    severity: "neutral",
    source: "Joint FAO/WHO Expert Committee on Food Additives (JECFA)",
  },
  {
    aliases: ["acesulfame potassium", "ace-k", "ins 950", "e950"],
    cleanName: "Acesulfame Potassium (INS 950)",
    insNumber: "INS 950",
    purpose: "Intense artificial sweetener often blended with sucralose",
    category: "sweetener",
    evidenceSummary: "Heat-stable non-caloric sweetener approved across major international food safety authorities (ADI 15 mg/kg bw).",
    context: "Excreted unchanged by kidneys. Blended to mask bitter aftertastes.",
    severity: "neutral",
    source: "EFSA Scientific Opinion & FSSAI Guidelines",
  },

  // Fats & Oils
  {
    aliases: ["palm oil", "palmolein", "refined palm oil", "refined palmolein", "fractionated palm oil"],
    cleanName: "Palmolein / Palm Oil",
    purpose: "Cooking and frying medium with high oxidative stability",
    category: "fat_oil",
    evidenceSummary: "Rich in saturated fatty acids (~50% palmitic acid). Regular high intake raises LDL cholesterol compared to unsaturated seed oils.",
    context: "Ubiquitous in packaged snacks due to long shelf-life and crisp texture. Balance with polyunsaturated (PUFA) oils in home cooking.",
    severity: "watch",
    source: "WHO Nutrition Guidelines & ICMR-NIN 2020",
  },
  {
    aliases: ["hydrogenated vegetable oil", "partially hydrogenated", "vanaspati"],
    cleanName: "Hydrogenated Vegetable Fat (Vanaspati)",
    purpose: "Solid fat substitute for ghee and butter",
    category: "fat_oil",
    evidenceSummary: "Traditional hydrogenation generates industrial trans-fatty acids (iTFA), strongly linked to coronary artery disease.",
    context: "FSSAI enforces strict trans-fat limits (<2% in fats & oils). Check label for 'Trans Fat: 0g'.",
    severity: "caution",
    source: "FSSAI Trans-Fat Elimination Mandate & WHO REPLACE",
  },
  {
    aliases: ["sunflower oil", "refined sunflower oil", "high oleic sunflower oil"],
    cleanName: "Sunflower Oil",
    purpose: "Edible vegetable oil rich in unsaturated fatty acids & Vitamin E",
    category: "fat_oil",
    evidenceSummary: "Low in saturated fat, rich in linoleic/oleic acid. Favourable lipid profile when consumed in moderation.",
    context: "Heart-friendly cooking oil option; best rotated with mustard or groundnut oil for balanced fatty acid ratio.",
    severity: "favorable",
    source: "ICMR-NIN Dietary Guidelines for Indians",
  },

  // Flours & Grains
  {
    aliases: ["refined wheat flour", "maida"],
    cleanName: "Refined Wheat Flour (Maida)",
    purpose: "Primary grain carbohydrate base",
    category: "whole_food",
    evidenceSummary: "Endosperm flour milled without bran and germ. Depleted of natural dietary fibre, B-vitamins, and minerals.",
    context: "Has a higher glycemic impact than whole grains. Common in biscuits, instant noodles, and snacks.",
    severity: "watch",
    source: "ICMR-NIN Nutritional Values of Indian Foods",
  },
  {
    aliases: ["whole wheat flour", "atta", "whole wheat"],
    cleanName: "Whole Wheat Flour (Atta)",
    purpose: "Whole grain flour preserving bran, germ, and endosperm",
    category: "whole_food",
    evidenceSummary: "Natural source of dietary fibre, magnesium, iron, and resistant starch. Promotes satiety and healthy digestion.",
    context: "Nutritionally superior to refined flour (maida). Recommended staple by ICMR.",
    severity: "favorable",
    source: "ICMR-NIN Dietary Guidelines",
  },
  {
    aliases: ["rolled oats", "oats", "oat flakes", "whole oats"],
    cleanName: "Whole Grain Oats",
    purpose: "Wholesome breakfast cereal grain rich in beta-glucan",
    category: "whole_food",
    evidenceSummary: "Contains soluble fibre beta-glucan (3g/day reduces blood LDL cholesterol and stabilizes glycemic response).",
    context: "Excellent low-GI breakfast staple. Watch out for flavored instant packets with high added sugar.",
    severity: "favorable",
    source: "EFSA Article 14 Health Claim & US FDA",
  },
  {
    aliases: ["besan", "gram flour", "bengal gram flour", "chana dal flour"],
    cleanName: "Bengal Gram Flour (Besan)",
    purpose: "Traditional Indian legume flour rich in plant protein",
    category: "whole_food",
    evidenceSummary: "Rich in plant protein (~20-22%), dietary fibre, and complex carbohydrates. Low glycemic index.",
    context: "Nutritious traditional base for Indian savory snacks and pancakes.",
    severity: "favorable",
    source: "ICMR-NIN Food Composition Tables",
  },

  // Preservatives & Antioxidants
  {
    aliases: ["sodium benzoate", "ins 211", "e211"],
    cleanName: "Sodium Benzoate (INS 211)",
    insNumber: "INS 211",
    purpose: "Antimicrobial preservative inhibiting yeasts and molds",
    category: "preservative",
    evidenceSummary: "Safe within established legal thresholds (ADI 0–5 mg/kg bw). Avoid simultaneous pairing with ascorbic acid (Vit C) in acidic drinks under heat.",
    context: "Permitted by FSSAI up to specified parts-per-million (ppm) in fruit squashes, sauces, and pickles.",
    severity: "neutral",
    source: "FSSAI Compendium of Food Additives & JECFA",
  },
  {
    aliases: ["potassium sorbate", "ins 202", "e202"],
    cleanName: "Potassium Sorbate (INS 202)",
    insNumber: "INS 202",
    purpose: "Widely used antifungal and antibacterial preservative",
    category: "preservative",
    evidenceSummary: "Metabolized naturally in the human body like dietary fatty acids into water and carbon dioxide.",
    context: "One of the safest recognized preservatives in cheese, dips, and baked products.",
    severity: "neutral",
    source: "EFSA Food Additives Assessment",
  },
  {
    aliases: ["tbhq", "ins 319", "tertiary butylhydroquinone"],
    cleanName: "TBHQ (INS 319)",
    insNumber: "INS 319",
    purpose: "Synthetic antioxidant preventing rancidity in frying oils",
    category: "preservative",
    evidenceSummary: "Extensively studied antioxidant with an established ADI (0.7 mg/kg bw). Legally permitted in oils and snacks.",
    context: "Prevents lipid peroxidation. Natural alternatives like mixed tocopherols (Vitamin E) are increasingly preferred.",
    severity: "neutral",
    source: "Codex Alimentarius General Standard for Food Additives",
  },
  {
    aliases: ["ascorbic acid", "ins 300", "vitamin c"],
    cleanName: "Ascorbic Acid (INS 300 / Vitamin C)",
    insNumber: "INS 300",
    purpose: "Natural antioxidant, acidity regulator & nutrient fortification",
    category: "fortification",
    evidenceSummary: "Essential water-soluble micronutrient and natural antioxidant that prevents discoloration.",
    context: "Completely safe and nutritionally beneficial.",
    severity: "favorable",
    source: "ICMR-NIN Recommended Dietary Allowances",
  },

  // Emulsifiers & Stabilizers
  {
    aliases: ["soya lecithin", "soy lecithin", "lecithin", "ins 322", "ins 322(i)", "e322"],
    cleanName: "Soya Lecithin (INS 322)",
    insNumber: "INS 322",
    purpose: "Natural phospholipid emulsifier preventing fat/water separation",
    category: "emulsifier_stabilizer",
    evidenceSummary: "Naturally occurring phospholipid found in eggs and soybeans. Source of dietary choline.",
    context: "Essential for smooth texture in chocolate and confectionery. Safe unless allergic to soy.",
    severity: "favorable",
    source: "EFSA Panel on Food Additives & US FDA GRAS",
  },
  {
    aliases: ["guar gum", "ins 412", "e412"],
    cleanName: "Guar Gum (INS 412)",
    insNumber: "INS 412",
    purpose: "Natural thickening and stabilizing soluble fibre from guar beans",
    category: "emulsifier_stabilizer",
    evidenceSummary: "Natural galactomannan polysaccharide from Indian cluster beans. Functions as dietary prebiotic fibre.",
    context: "Improves texture in ice creams, sauces, and gluten-free formulations.",
    severity: "favorable",
    source: "Codex Alimentarius & FSSAI Standards",
  },
  {
    aliases: ["xanthan gum", "ins 415", "e415"],
    cleanName: "Xanthan Gum (INS 415)",
    insNumber: "INS 415",
    purpose: "Fermentation-derived stabilizing and thickening agent",
    category: "emulsifier_stabilizer",
    evidenceSummary: "Biocompatible polysaccharide with high viscosity at low concentrations. Safe without ADI limitation.",
    context: "Widely used to provide pleasant mouthfeel and prevent ingredient settling.",
    severity: "neutral",
    source: "JECFA Evaluation of Food Additives",
  },
  {
    aliases: ["carrageenan", "ins 407", "e407"],
    cleanName: "Carrageenan (INS 407)",
    insNumber: "INS 407",
    purpose: "Gelling agent and thickener derived from red seaweed",
    category: "emulsifier_stabilizer",
    evidenceSummary: "Food-grade degraded vs undegraded carrageenan distinction is critical. Food-grade is permitted by FSSAI & EFSA.",
    context: "Some individuals with irritable bowel disease report gastrointestinal sensitivity.",
    severity: "neutral",
    source: "EFSA Re-evaluation of Carrageenan (E 407)",
  },
  {
    aliases: ["mono- and diglycerides of fatty acids", "ins 471", "e471"],
    cleanName: "Mono- and Diglycerides of Fatty Acids (INS 471)",
    insNumber: "INS 471",
    purpose: "Emulsifier improving bread softness and product crumb structure",
    category: "emulsifier_stabilizer",
    evidenceSummary: "Derived from vegetable or animal fats; metabolized normally like dietary fats.",
    context: "Vegetarians should verify plant origin (most Indian manufacturers use vegetable-derived 471 with green dot).",
    severity: "neutral",
    source: "FSSAI Food Safety Standards",
  },

  // Acidity Regulators & Raising Agents
  {
    aliases: ["citric acid", "ins 330", "e330"],
    cleanName: "Citric Acid (INS 330)",
    insNumber: "INS 330",
    purpose: "Natural acidity regulator, flavor enhancer & antioxidant synergist",
    category: "acid_regulator",
    evidenceSummary: "Key intermediate in human cellular energy metabolism (Krebs Cycle). Safe without ADI limit.",
    context: "Provides tart taste in beverages, jams, and candies.",
    severity: "favorable",
    source: "JECFA & FSSAI",
  },
  {
    aliases: ["sodium bicarbonate", "baking soda", "ins 500(ii)", "e500"],
    cleanName: "Sodium Bicarbonate (Baking Soda / INS 500ii)",
    insNumber: "INS 500(ii)",
    purpose: "Traditional leavening agent releasing carbon dioxide gas",
    category: "acid_regulator",
    evidenceSummary: "Inert culinary raising agent. Contributes small amounts of sodium to the overall mineral profile.",
    context: "Standard kitchen and commercial baking ingredient.",
    severity: "favorable",
    source: "FSSAI Guidelines",
  },

  // Flavor Enhancers & Colors
  {
    aliases: ["monosodium glutamate", "msg", "ins 621", "e621", "flavour enhancer (621)"],
    cleanName: "Monosodium Glutamate / MSG (INS 621)",
    insNumber: "INS 621",
    purpose: "Umami flavor enhancer bringing savory depth",
    category: "color_flavor",
    evidenceSummary: "Sodium salt of glutamic acid, an amino acid naturally abundant in tomatoes, cheese, and mushrooms. Rigorous double-blind clinical trials find no evidence of toxicity at normal culinary levels.",
    context: "FSSAI permits MSG in specified foods with declaration. Myth of 'Chinese Restaurant Syndrome' was debunked by WHO/US FDA.",
    severity: "neutral",
    source: "WHO/FAO JECFA Monograph & US FDA Evidence Review",
  },
  {
    aliases: ["caramel iv", "caramel color iv", "ins 150d", "e150d", "sulphite ammonia caramel"],
    cleanName: "Caramel Color IV (Sulphite Ammonia / INS 150d)",
    insNumber: "INS 150d",
    purpose: "Dark brown food color used in colas, sauces, and baked goods",
    category: "color_flavor",
    evidenceSummary: "Manufactured by heating carbohydrates with ammonium and sulphite compounds. Regulated strictly for 4-MEI byproduct content.",
    context: "Permitted within strict limits by FSSAI & EFSA. Clean-label foods often avoid synthetic caramels.",
    severity: "watch",
    source: "EFSA Scientific Opinion on Caramel Colours",
  },
  {
    aliases: ["tartrazine", "ins 102", "e102", "yellow 5"],
    cleanName: "Tartrazine (INS 102)",
    insNumber: "INS 102",
    purpose: "Synthetic lemon yellow azo dye",
    category: "color_flavor",
    evidenceSummary: "Permitted synthetic color. Can trigger pseudo-allergic symptoms (hives, rhinitis) in a small subset of aspirin-sensitive individuals.",
    context: "Must be explicitly declared on packaged food labels in India per FSSAI regulations.",
    severity: "watch",
    source: "FSSAI Labeling Regulations & EFSA Scientific Opinion",
  },
  {
    aliases: ["iodised salt", "salt", "edible common salt", "vacuum evaporated salt"],
    cleanName: "Iodised Salt",
    purpose: "Essential seasoning, microbial control & iodine deficiency prevention",
    category: "other",
    evidenceSummary: "Fortified with potassium iodate per Indian mandate to eradicate goitre and cognitive impairment.",
    context: "Essential nutrient, but excessive sodium intake (>2000mg/day) increases hypertension and stroke risk.",
    severity: "neutral",
    source: "National Iodine Deficiency Disorders Control Programme (NIDDCP) & ICMR",
  },
];

/**
 * Matches an extracted ingredient string against our curated knowledge base.
 */
export function analyzeIngredient(rawIngredient: string): IngredientFinding {
  const normalized = rawIngredient.trim().toLowerCase();

  // Try to find matching curated entry
  for (const record of INGREDIENTS_DATABASE) {
    const isMatch = record.aliases.some((alias) => {
      // Check exact match or boundary match
      if (normalized === alias) return true;
      if (normalized.includes(alias)) return true;
      return false;
    });

    if (isMatch) {
      return {
        ingredient: rawIngredient,
        cleanName: record.cleanName,
        insNumber: record.insNumber || null,
        purpose: record.purpose,
        category: record.category,
        evidenceSummary: record.evidenceSummary,
        context: record.context,
        severity: record.severity,
        confidence: "high",
        source: record.source,
      };
    }
  }

  // Fallback for general uncurated ingredients
  const isAdditive = /ins\s*\d+|e\d{3,4}|\badditive\b|\bpreservative\b|\bemulsifier\b/i.test(rawIngredient);

  return {
    ingredient: rawIngredient,
    cleanName: rawIngredient.trim(),
    insNumber: extractInsNumber(rawIngredient),
    purpose: isAdditive ? "Food Additive / Processing Aid" : "Agricultural Food Ingredient",
    category: isAdditive ? "other" : "whole_food",
    evidenceSummary: "Standard food component recognized in food safety inventories. No flagged health concern in scientific consensus.",
    context: "Nutritional impact is determined primarily by the overall food matrix, frequency, and serving portion.",
    severity: "neutral",
    confidence: "medium",
    source: "Codex Alimentarius / FSSAI Inventory",
  };
}

function extractInsNumber(text: string): string | null {
  const match = text.match(/\b(?:ins|e)\s*([0-9]{3,4}[a-z]?)/i);
  return match ? `INS ${match[1].toUpperCase()}` : null;
}
