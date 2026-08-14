import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/shared/infrastructure/env";

const PROTECTED_PREFIXES = ["/dashboard"] as const;
const SIGNIN_PATH = "/signin";
const DASHBOARD_PATH = "/dashboard";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (isProtected && !user) {
    return NextResponse.redirect(new URL(SIGNIN_PATH, request.url));
  }

  if (user && request.nextUrl.pathname === SIGNIN_PATH) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
