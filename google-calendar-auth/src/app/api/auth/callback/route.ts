import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCode } from "@/lib/google";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}?error=missing_code`
    );
  }

  try {
    const tokens = await getTokenFromCode(code);

    const params = new URLSearchParams({
      access_token: tokens.access_token || "",
      refresh_token: tokens.refresh_token || "",
      expires_in: tokens.expiry_date?.toString() || "",
    });

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/?${params.toString()}`
    );
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}?error=token_exchange_failed`
    );
  }
}
