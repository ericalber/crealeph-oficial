import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";

export async function GET() {
  let templates:
    | {
        id: string;
        name: string;
        type: string;
        description: string;
        config: any;
        vertical?: { slug: string; name: string } | null;
      }[]
    | null = null;

  try {
    templates = await prisma.agentTemplate.findMany({
      include: { vertical: { select: { slug: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    templates = null;
  }

  const fallback = [
    {
      id: "tpl-cleaning-parasite",
      name: "Cleaning Parasite",
      type: "parasite",
      description: "Observer bot for cleaning businesses.",
      config: {},
      vertical: { slug: "cleaning", name: "Cleaning" },
    },
    {
      id: "tpl-delivery-parasite",
      name: "Delivery Parasite",
      type: "parasite",
      description: "Observer bot for delivery and food.",
      config: {},
      vertical: { slug: "delivery", name: "Delivery" },
    },
    {
      id: "tpl-realestate-parasite",
      name: "Real Estate Parasite",
      type: "parasite",
      description: "Observer bot for real estate offers.",
      config: {},
      vertical: { slug: "real-estate", name: "Real Estate" },
    },
  ];

  const data =
    templates && templates.length > 0
      ? templates.map((tpl) => ({
          id: tpl.id,
          name: tpl.name,
          type: tpl.type,
          description: tpl.description,
          config: tpl.config,
          vertical: tpl.vertical ?? null,
        }))
      : fallback;

  return NextResponse.json({ ok: true, data });
}
