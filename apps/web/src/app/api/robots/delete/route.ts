import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { id } = body ?? {};
  if (!id) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });
  const tenantId = getTenantId();

  await prisma.robot.updateMany({
    where: { id, tenantId },
    data: { status: "deleted" },
  });

  return NextResponse.json({ ok: true, data: { id } });
}
