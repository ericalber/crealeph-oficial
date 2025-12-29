import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET(request: Request) {
  const tenantId = getTenantId();
  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const limit = (() => {
    const parsed = Number(limitParam);
    if (!Number.isFinite(parsed) || parsed <= 0) return 50;
    return Math.min(parsed, 200);
  })();

  const failures = await prisma.intelligenceLedgerFailure.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ ok: true, data: failures });
}
