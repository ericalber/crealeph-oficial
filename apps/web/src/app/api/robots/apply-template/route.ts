import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, message: "placeholder", data: {} });
}
