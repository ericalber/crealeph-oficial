import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import { getIntelligenceSnapshot } from "@/lib/ledger";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const tenantId = getTenantId();
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "robotId required" }, { status: 400 });

  const snapshot = await getIntelligenceSnapshot(prisma, { tenantId, robotId });
  return NextResponse.json({ ok: true, data: snapshot });
}
