import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET() {
  const tenantId = getTenantId();
  const robots = await prisma.robot.findMany({
    where: { tenantId, status: { not: "deleted" } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, data: robots });
}
