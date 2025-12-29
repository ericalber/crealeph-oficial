import { NextResponse } from "next/server";
import type { PolicyInputV1_1 } from "@/lib/contracts/policy-engine-v1_1";
import {
  validatePolicyInputV1_1,
  validatePolicyOutputV1_1,
} from "@/lib/contracts/policy-engine-v1_1-validate";
import { evaluatePolicyV1_1 } from "@/lib/policy/policy-engine-v1_1";

function isPolicyInputV1_1(value: unknown): value is PolicyInputV1_1 {
  return validatePolicyInputV1_1(value).ok;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isPolicyInputV1_1(body)) {
    return NextResponse.json({ ok: false, error: "VALIDATION_ERROR" }, { status: 400 });
  }

  const output = evaluatePolicyV1_1(body);
  const outputValidation = validatePolicyOutputV1_1(output, body);
  if (!outputValidation.ok) {
    return NextResponse.json({ ok: false, error: "VALIDATION_ERROR" }, { status: 500 });
  }

  return NextResponse.json(output);
}
