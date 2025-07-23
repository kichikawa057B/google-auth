# Google Calendar OAuth2 認証アプリ

GoogleカレンダーへのアクセスのためのOAuth2認証を行い、アクセストークンを取得するNext.jsアプリケーションです。

## セットアップ

### 1. Google Cloud Console での設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成するか、既存のプロジェクトを選択
3. 「APIs & Services」→「Enable APIs and Services」から「Google Calendar API」を有効化
4. 「APIs & Services」→「Credentials」→「Create Credentials」→「OAuth 2.0 Client IDs」を選択
5. Application typeを「Web application」に設定
6. Authorized redirect URIsに `http://localhost:3000/api/auth/callback` を追加
7. Client IDとClient Secretをコピー

### 2. 環境変数の設定

`.env.local`ファイルを編集し、Google Cloud Consoleで取得した値を設定:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 3. 依存関係のインストールと実行

```bash
cd google-calendar-auth
pnpm install
pnpm dev
```

http://localhost:3000 にアクセスしてアプリケーションを使用できます。

## 使用方法

1. 「Googleアカウントで認証」ボタンをクリック
2. Googleアカウントでログインし、カレンダーアクセスを許可
3. 表示されたアクセストークンをコピーして使用

## 機能

- OAuth2認証フロー
- アクセストークンとリフレッシュトークンの表示
- ワンクリックでのトークンコピー機能
- トークンの有効期限表示（1ヶ月間有効）
- エラーハンドリング

## ファイル構成

- `src/app/page.tsx` - メインのUI画面
- `src/app/api/auth/google/route.ts` - OAuth2認証開始エンドポイント
- `src/app/api/auth/callback/route.ts` - OAuth2コールバック処理
- `src/lib/google.ts` - Google API関連のユーティリティ
- `.env.local` - 環境変数設定ファイル
