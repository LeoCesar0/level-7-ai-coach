import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { firebaseAuth } from "./lib/firebase";
import { cookies, headers } from "next/headers";
import { AppResponse } from "@common/schemas/app";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // const userRes = await fetch("http://localhost:3000/api/auth/me");

  // const currentUser = await userRes.json();
  // console.log("❗ here currentUser -->", currentUser);
  //   return NextResponse.redirect(new URL("/", request.url));

  const token = cookies().get("token");

  if (token) {
    try {
      const userRes = await fetch("http://backend:8000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      const resData: AppResponse<any> = await userRes.json();
      const currentUser = resData.data;
    } catch (err) {}
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/dashboard/:path*"],
};
