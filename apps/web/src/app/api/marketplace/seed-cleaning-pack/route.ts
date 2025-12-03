import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  const cleaningSlug = "cleaning";
  const vertical = await prisma.vertical.upsert({
    where: { slug: cleaningSlug },
    update: { name: "Cleaning" },
    create: { slug: cleaningSlug, name: "Cleaning" },
  });

  await prisma.templatePack.upsert({
    where: { id: "cleaning-parasite-pack" },
    update: {
      name: "Cleaning Parasite Pack",
      description:
        "Optimized parasite intelligence for cleaning industry: deep clean, move-out, pricing windows, review patterns.",
      config: {
        vertical: "cleaning",
        serviceTypes: ["deep clean", "move-out", "move-in", "recurring", "post-construction"],
        competitorKeywords: ["cleaning service", "house cleaners", "maid service", "deep clean deal"],
        reviewCategories: ["punctuality", "quality", "professionalism", "pricing", "communication"],
        priceRanges: { "1bed": 120, "2bed": 160, "3bed": 200 },
      },
      verticalId: vertical.id,
    },
    create: {
      id: "cleaning-parasite-pack",
      verticalId: vertical.id,
      name: "Cleaning Parasite Pack",
      description:
        "Optimized parasite intelligence for cleaning industry: deep clean, move-out, pricing windows, review patterns.",
      config: {
        vertical: "cleaning",
        serviceTypes: ["deep clean", "move-out", "move-in", "recurring", "post-construction"],
        competitorKeywords: ["cleaning service", "house cleaners", "maid service", "deep clean deal"],
        reviewCategories: ["punctuality", "quality", "professionalism", "pricing", "communication"],
        priceRanges: { "1bed": 120, "2bed": 160, "3bed": 200 },
      },
    },
  });

  return NextResponse.json({ ok: true });
}
