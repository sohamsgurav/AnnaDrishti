import { NextRequest, NextResponse } from "next/server";
import { findVerifiedAlternatives } from "@/lib/alternatives";
import { NormalizedNutritionValuesSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, productName, goal, currentNutrition } = body;

    const validatedNutrition = NormalizedNutritionValuesSchema.parse(currentNutrition);

    const alternatives = await findVerifiedAlternatives({
      category,
      productName,
      goal: goal || "general",
      currentNutrition: validatedNutrition,
    });

    return NextResponse.json({ alternatives }, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/alternatives error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alternative products." },
      { status: 500 }
    );
  }
}
