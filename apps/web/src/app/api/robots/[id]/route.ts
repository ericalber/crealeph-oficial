import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const tenantId = getTenantId();
  const robot = await prisma.robot.findFirst({
    where: { id: params.id, tenantId },
  });
  return NextResponse.json({ ok: true, data: robot ?? null });
}
