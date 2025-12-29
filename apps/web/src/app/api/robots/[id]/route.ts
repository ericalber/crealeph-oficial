import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import { getDevRobot, isDbConnectionError } from "@/lib/robots/devStore";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const tenantId = getTenantId();
  try {
    const robot = await prisma.robot.findFirst({
      where: { id: params.id, tenantId },
    });
    return NextResponse.json({ ok: true, data: robot ?? null });
  } catch (error) {
    if (isDbConnectionError(error)) {
      const robot = getDevRobot(tenantId, params.id);
      return NextResponse.json({ ok: true, data: robot ?? null, devMode: true });
    }
    throw error;
  }
}
