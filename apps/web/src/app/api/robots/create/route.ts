import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const tenantId = getTenantId();
  const name = body.name ?? "Parasite Bot";
  const type = body.type ?? "parasite";
  const config = body.config ?? {};

  const robot = await prisma.robot.create({
    data: {
      name,
      type,
      config,
      tenantId,
    },
  });

  return NextResponse.json({ ok: true, data: robot });
}
