import { NextResponse } from "next/server";
import type { PolicyInput } from "@/lib/contracts/policy-engine";
import { validatePolicyInput } from "@/lib/contracts/policy-engine-validate";
import { evaluatePolicy } from "@/lib/policy/policy-engine";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as PolicyInput | null;
  const validation = validatePolicyInput(body);
  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: "VALIDATION_ERROR" }, { status: 400 });
  }

  const output = evaluatePolicy(body as PolicyInput);
  return NextResponse.json(output);
}
