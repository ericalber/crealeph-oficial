import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";

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

  const copies = await prisma.robotCopy.findMany({
    where: { robot: { id: robotId, tenantId } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json({ ok: true, data: copies });
}
