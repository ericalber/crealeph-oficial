import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import { appendLedgerEntry } from "@/lib/ledger";
import {
  createDevCompetitor,
  deleteDevCompetitor,
  getDevRobot,
  isDbConnectionError,
  listDevCompetitors,
} from "@/lib/robots/devStore";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const tenantId = getTenantId();
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });

  try {
    const competitors = await prisma.competitorProfile.findMany({
      where: { robot: { id: robotId, tenantId } },
      orderBy: { createdAt: "desc" },
      include: {
        insights: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ ok: true, data: competitors });
  } catch (error) {
    if (isDbConnectionError(error)) {
      const competitors = listDevCompetitors(robotId);
      return NextResponse.json({ ok: true, data: competitors, devMode: true });
    }
    throw error;
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const tenantId = getTenantId();
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });

  const payload = await request.json().catch(() => null);
  const name = typeof payload?.name === "string" ? payload.name.trim() : "";
  const url = typeof payload?.url === "string" ? payload.url.trim() : "";
  const reviewsUrl = typeof payload?.reviewsUrl === "string" ? payload.reviewsUrl.trim() : "";

  if (!name || !url) {
    return NextResponse.json(
      { ok: false, message: "name and url required" },
      { status: 400 },
    );
  }

  try {
    const robot = await prisma.robot.findFirst({
      where: { id: robotId, tenantId },
    });

    if (!robot) {
      return NextResponse.json({ ok: false, message: "robot not found" }, { status: 404 });
    }

    const competitor = await prisma.competitorProfile.create({
      data: {
        robotId: robot.id,
        name,
        url,
        reviewsUrl: reviewsUrl || null,
      },
    });

    await appendLedgerEntry(prisma, {
      tenantId,
      module: "robots",
      source: "competitor-profile",
      type: "event",
      state: "approved",
      payload: { id: competitor.id, name, url, reviewsUrl: reviewsUrl || null },
      lineage: { robotId: robot.id },
      robotId: robot.id,
    });

    return NextResponse.json({ ok: true, data: competitor });
  } catch (error) {
    if (isDbConnectionError(error)) {
      const robot = getDevRobot(tenantId, robotId);
      if (!robot) {
        return NextResponse.json({ ok: false, message: "robot not found" }, { status: 404 });
      }
      const competitor = createDevCompetitor(robotId, name, url, reviewsUrl || null);
      return NextResponse.json({ ok: true, data: competitor, devMode: true });
    }
    throw error;
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const tenantId = getTenantId();
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });

  const payload = await request.json().catch(() => null);
  const competitorId =
    typeof payload?.competitorId === "string" ? payload.competitorId.trim() : "";

  if (!competitorId) {
    return NextResponse.json(
      { ok: false, message: "competitorId required" },
      { status: 400 },
    );
  }

  try {
    const competitor = await prisma.competitorProfile.findFirst({
      where: { id: competitorId, robot: { id: robotId, tenantId } },
    });

    if (!competitor) {
      return NextResponse.json({ ok: false, message: "competitor not found" }, { status: 404 });
    }

    await prisma.competitorInsight.deleteMany({
      where: { competitorId },
    });

    await prisma.competitorProfile.delete({
      where: { id: competitorId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isDbConnectionError(error)) {
      deleteDevCompetitor(competitorId);
      return NextResponse.json({ ok: true, devMode: true });
    }
    throw error;
  }
}
