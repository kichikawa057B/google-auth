"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import WeeklyCalendar from "@/components/WeeklyCalendar";

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<string | null>(null);

  useEffect(() => {
    // URLパラメータからトークンを取得
    const token = searchParams.get("access_token");
    const refresh = searchParams.get("refresh_token");
    const expires = searchParams.get("expires_in");
    
    if (token) {
      setAccessToken(token);
      setRefreshToken(refresh);
      setExpiresIn(expires);
    } else {
      // セッションストレージからトークンを取得（既存の認証フローから）
      const storedToken = sessionStorage.getItem("google_access_token");
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, [searchParams]);

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">認証が必要です</h1>
          <p className="text-gray-600 mb-6">
            Googleカレンダーにアクセスするために認証を行ってください。
          </p>
          <a
            href="/api/auth/google"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Google認証
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <WeeklyCalendar 
        accessToken={accessToken} 
        refreshToken={refreshToken}
        expiresIn={expiresIn}
      />
    </div>
  );
}