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

