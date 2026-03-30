# NestJS Hands-on 🚀

NestJS + TypeScript + Docker + MySQL + TypeORM を使用したハンズオンプロジェクトです。

---

## 🛠 環境構築

### 前提条件
- Docker & Docker Compose がインストールされていること
- ポート 4003, 3308 が空いていること

### 起動手順

```bash
# 1. プロジェクトディレクトリに移動
cd /Users/kyohei_takashima/workspace/nestjs-handson

# 2. Docker環境をビルド＆起動
docker compose up -d --build

# 3. ログを確認（起動完了まで待つ）
docker compose logs -f app

# 4. 起動確認（別のターミナルで）
curl http://localhost:4003
curl http://localhost:4003/health
```

起動が成功すると、以下のURLでアクセスできます：
- **API**: http://localhost:4003
- **Health Check**: http://localhost:4003/health
- **MySQL**: localhost:3308
## 🗄 データベース・マイグレーション

当プロジェクトでは、TypeORM を使用してデータベースのスキーマ管理を行っています。
`synchronize: true` はデータ紛失の恐れがあるため、開発環境・本番環境ともに **マイグレーションによる管理** を推奨します。

### 🔄 開発サイクル

テーブル構造を変更する際は、以下の 3 ステップで行います。

#### 1. Entity の作成・編集
`src/**/entities/*.entity.ts` を編集し、`@Column` などのデコレータを使用して「理想のテーブル構造」を定義します。

#### 2. マイグレーションファイルの生成 (Generate)
「コード上の Entity」と「実際の DB 構造」の差分を抽出し、SQL 手順書を作成します。
※ Docker コンテナ内で実行してください。

```bash
docker-compose exec app npm run typeorm -- migration:generate src/migrations/ファイル名 -d src/database/data-source.ts

