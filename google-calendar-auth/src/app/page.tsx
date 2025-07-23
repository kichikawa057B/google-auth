"use client";

import { useEffect, useState } from "react";

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

interface UserInfo {
  email: string;
  name: string;
  picture: string;
}

export default function Home() {
  const [tokens, setTokens] = useState<TokenData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");
    const expiresIn = urlParams.get("expires_in");
    const errorParam = urlParams.get("error");

    if (errorParam) {
      setError(errorParam);
    } else if (accessToken) {
      setTokens({
        access_token: accessToken,
        refresh_token: refreshToken || "",
        expires_in: expiresIn || "",
      });

      // ユーザー情報を取得
      fetchUserInfo(accessToken);
    }
  }, []);

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error("ユーザー情報の取得に失敗:", error);
    }
  };

  const handleAuth = () => {
    window.location.href = "/api/auth/google";
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const formatExpiryDate = (timestamp: string) => {
    if (!timestamp) return "N/A";
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString("ja-JP");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Google Calendar OAuth2認証
          </h1>
          <p className="mt-2 text-gray-600">
            Googleカレンダーにアクセスするためのトークンを取得
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">エラー: {error}</p>
          </div>
        )}

        {!tokens && !error && (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <button
              onClick={handleAuth}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Googleアカウントで認証
            </button>
          </div>
        )}

        {tokens && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              認証完了
            </h2>

            {userInfo && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-3">
                  {userInfo.picture && (
                    <img
                      src={userInfo.picture}
                      alt="プロフィール画像"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-green-800">
                      {userInfo.name}
                    </p>
                    <p className="text-sm text-green-600">{userInfo.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {tokens.refresh_token && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    リフレッシュトークン:
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tokens.refresh_token}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm text-black"
                    />
                    <button
                      onClick={() => copyToClipboard(tokens.refresh_token)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-r-md transition-colors text-sm"
                    >
                      {copied ? "コピー済み" : "コピー"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
              <a
                href={`/calendar?access_token=${tokens.access_token}${tokens.refresh_token ? `&refresh_token=${tokens.refresh_token}` : ''}${tokens.expires_in ? `&expires_in=${tokens.expires_in}` : ''}`}
                className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                カレンダーを表示
              </a>
              <button
                onClick={() => {
                  setTokens(null);
                  setError(null);
                  setUserInfo(null);
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                新しい認証を開始
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">使用方法:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. 「Googleアカウントで認証」ボタンをクリック</li>
            <li>2. Googleアカウントでログインし、カレンダーアクセスを許可</li>
            <li>3. 表示されたアクセストークンをコピーして使用</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
