import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, verifyAccess } from "@/lib/access";

// La demo no es pública: sin un acceso válido emitido por el servidor,
// las páginas vuelven al login y las APIs responden 401.
export async function proxy(request: NextRequest) {
  const allowed = await verifyAccess(request.cookies.get(ACCESS_COOKIE)?.value);
  if (allowed) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { code: "ACCESS_REQUIRED", message: "Acceso privado requerido." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/demo", "/demo/:path*", "/api/analysis/:path*", "/api/k8/:path*"],
};
