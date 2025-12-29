import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import { createDevRobot, isDbConnectionError } from "@/lib/robots/devStore";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const tenantId = getTenantId();
  const name = body.name ?? "Parasite Bot";
  const type = body.type ?? "parasite";
  const config = body.config ?? {};

  try {
    const robot = await prisma.robot.create({
      data: {
        name,
        type,
        config,
        tenantId,
      },
    });

    return NextResponse.json({ ok: true, data: robot });
  } catch (error) {
    if (isDbConnectionError(error)) {
      const robot = createDevRobot(tenantId, name, type, config);
      return NextResponse.json({ ok: true, data: robot, devMode: true });
    }
    throw error;
  }
}
