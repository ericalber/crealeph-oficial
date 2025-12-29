import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import { isDbConnectionError, listDevRobots } from "@/lib/robots/devStore";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET() {
  const tenantId = getTenantId();
  try {
    const robots = await prisma.robot.findMany({
      where: { tenantId, status: { not: "deleted" } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: robots });
  } catch (error) {
    if (isDbConnectionError(error)) {
      const robots = listDevRobots(tenantId);
      return NextResponse.json({ ok: true, data: robots, devMode: true });
    }
    throw error;
  }
}
