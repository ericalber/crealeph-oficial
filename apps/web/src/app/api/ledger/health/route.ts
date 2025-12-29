import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET() {
  const tenantId = getTenantId();
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [last24h, last1h] = await Promise.all([
    prisma.intelligenceLedgerFailure.count({
      where: { tenantId, createdAt: { gte: oneDayAgo } },
    }),
    prisma.intelligenceLedgerFailure.count({
      where: { tenantId, createdAt: { gte: oneHourAgo } },
    }),
  ]);

  const lastFailure = await prisma.intelligenceLedgerFailure.findFirst({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });

  const status = last24h > 0 ? "warning" : "ok";

  return NextResponse.json({
    ok: true,
    data: {
      failuresLast24h: last24h,
      failuresLast1h: last1h,
      lastFailureAt: lastFailure?.createdAt ?? null,
      status,
    },
  });
}
