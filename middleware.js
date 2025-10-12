import { NextResponse } from "next/server";
export function middleware(req) {
  if (req.method === "OPTIONS") {
    const pre = new NextResponse(null, { status: 200 });
    pre.headers.set("Access-Control-Allow-Origin", "*");
    pre.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    pre.headers.set("Access-Control-Allow-Headers", "Content-Type, x-admin-key");
    return pre;
  }
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, x-admin-key");
  return res;
}
export const config = { matcher: "/api/:path*" };
