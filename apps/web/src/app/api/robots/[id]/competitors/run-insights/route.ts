import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import { harvestReviewsForCompetitor } from "@/lib/robots/reviews";
import { appendLedgerEntry } from "@/lib/ledger";
import {
  createDevInsight,
  getDevRobot,
  isDbConnectionError,
  listDevCompetitors,
} from "@/lib/robots/devStore";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const tenantId = getTenantId();
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });

  try {
    const robot = await prisma.robot.findFirst({
      where: { id: robotId, tenantId },
    });

    if (!robot) {
      return NextResponse.json({ ok: false, message: "robot not found" }, { status: 404 });
    }

    const competitors = await prisma.competitorProfile.findMany({
      where: { robotId: robot.id },
      orderBy: { createdAt: "desc" },
    });

    if (competitors.length === 0) {
      return NextResponse.json(
        { ok: false, message: "no competitors found" },
        { status: 400 },
      );
    }

    const insights = await Promise.all(
      competitors.map(async (competitor) => {
        const summary = await harvestReviewsForCompetitor({
          name: competitor.name,
          url: competitor.url,
          reviewsUrl: competitor.reviewsUrl,
        });

        const insight = await prisma.competitorInsight.create({
          data: {
            competitorId: competitor.id,
            summaryJson: summary,
          },
        });

        await appendLedgerEntry(prisma, {
          tenantId,
          module: "robots",
          source: "competitor-insight",
          type: "insight",
          state: "approved",
          payload: summary,
          lineage: { competitorId: competitor.id, insightId: insight.id, robotId: robot.id },
          robotId: robot.id,
        });

        return { competitorId: competitor.id, insightId: insight.id, summaryJson: summary };
      }),
    );

    return NextResponse.json({ ok: true, data: insights });
  } catch (error) {
    if (isDbConnectionError(error)) {
      const robot = getDevRobot(tenantId, robotId);
      if (!robot) {
        return NextResponse.json({ ok: false, message: "robot not found" }, { status: 404 });
      }
      const competitors = listDevCompetitors(robotId);
      if (competitors.length === 0) {
        return NextResponse.json(
          { ok: false, message: "no competitors found" },
          { status: 400 },
        );
      }

      const insights = await Promise.all(
        competitors.map(async (competitor) => {
          const summary = await harvestReviewsForCompetitor({
            name: competitor.name,
            url: competitor.url,
            reviewsUrl: competitor.reviewsUrl,
          });
          const insight = createDevInsight(competitor.id, summary);
          return { competitorId: competitor.id, insightId: insight.id, summaryJson: summary };
        }),
      );

      return NextResponse.json({ ok: true, data: insights, devMode: true });
    }
    throw error;
  }
}
