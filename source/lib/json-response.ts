import { NextResponse } from "next/server";

export function json(data: any, init?: ResponseInit) {
  return NextResponse.json(data, init);
}
