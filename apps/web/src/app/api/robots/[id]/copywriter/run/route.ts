import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });
  const tenantId = getTenantId();

  const robot = await prisma.robot.findFirst({ where: { id: robotId, tenantId } });
  if (!robot) return NextResponse.json({ ok: false, message: "not found" }, { status: 404 });

  const latestRun = await prisma.robotRun.findFirst({
    where: { robotId: robot.id },
    orderBy: { createdAt: "desc" },
  });

  const latestIdea = await prisma.robotIdea.findFirst({
    where: { robotId: robot.id },
    orderBy: { createdAt: "desc" },
  });

  if (!latestRun || !latestIdea) {
    return NextResponse.json({ ok: false, message: "no signals or campaigns available" }, { status: 400 });
  }

  const fallback = {
    landingPageSections: [
      { title: "Why choose us", body: "We provide reliable and high quality service." },
    ],
    longFormScript: "We help your business communicate with clarity and consistency.",
    emailVariants: ["Subject: Time to upgrade your service", "Body: Here is how we can help."],
    adVariants: ["Clean home, clear mind.", "Smarter campaigns for your niche."],
    socialPosts: ["We just launched smarter bots for your industry."],
  };

  if (!process.env.OPENAI_API_KEY) {
    await prisma.robotCopy.create({
      data: { robotId: robot.id, result: fallback },
    });
    return NextResponse.json({ ok: true, data: fallback });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are COPYWRITER V1. Based on the given market signals and ideator campaigns, produce long-form content. Always output JSON with: landingPageSections, longFormScript, emailVariants, adVariants, socialPosts. landingPageSections is an array of { title, body }.",
        },
        {
          role: "user",
          content: JSON.stringify({
            parasite: latestRun.result,
            ideator: latestIdea.result,
            config: robot.config,
          }),
        },
      ],
      temperature: 0.3,
    });

    const content = completion.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content);
    const result = parsed ?? fallback;

    await prisma.robotCopy.create({
      data: { robotId: robot.id, result },
    });

    return NextResponse.json({ ok: true, data: result });
  } catch {
    await prisma.robotCopy.create({
      data: { robotId: robot.id, result: fallback },
    });
    return NextResponse.json({ ok: true, data: fallback });
  }
}
