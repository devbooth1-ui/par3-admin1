import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, x-admin-key");
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: res.headers });
  }
  return res;
}
export const config = { matcher: "/api/:path*" };
