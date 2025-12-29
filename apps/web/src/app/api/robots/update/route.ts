import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { id, config, status } = body ?? {};
  if (!id) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });
  const tenantId = getTenantId();

  const robot = await prisma.robot.updateMany({
    where: { id, tenantId },
    data: {
      ...(config ? { config } : {}),
      ...(status ? { status } : {}),
    },
  });

  const updated = await prisma.robot.findFirst({ where: { id, tenantId } });
  return NextResponse.json({ ok: true, data: updated, count: robot.count });
}
