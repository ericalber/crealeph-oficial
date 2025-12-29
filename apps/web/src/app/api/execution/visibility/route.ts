import { NextResponse } from "next/server";
import { handleExecutionVisibilityRequest } from "@/lib/execution/visibility";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET(request: Request) {
  const tenantId = getTenantId();
  const result = await handleExecutionVisibilityRequest(request, tenantId);
  return NextResponse.json(result.body, { status: result.status });
}
