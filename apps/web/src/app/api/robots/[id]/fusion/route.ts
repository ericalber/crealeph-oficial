import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import { getLatestDevFusion, isDbConnectionError } from "@/lib/robots/devStore";

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
    const fusion = await prisma.robotFusion.findFirst({
      where: { robot: { id: robotId, tenantId } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, data: fusion ?? null });
  } catch (error) {
    if (isDbConnectionError(error)) {
      const fusion = getLatestDevFusion(robotId);
      return NextResponse.json({ ok: true, data: fusion ?? null, devMode: true });
    }
    throw error;
  }
}
