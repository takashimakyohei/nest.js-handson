# NestJS ハンズオン - クイックスタート 🚀

## 起動コマンド

```bash
# 1. プロジェクトディレクトリに移動
cd /Users/kyohei_takashima/workspace/nestjs-handson

# 2. Dockerが起動していることを確認（Docker Desktopを起動）

# 3. Docker環境をビルド＆起動
docker compose up -d --build

# 4. ログを確認（起動完了まで30秒〜1分待つ）
docker compose logs -f app

# "Application is running on: http://localhost:4003" が表示されたら成功！
# Ctrl+C でログ表示を終了
```

## 動作確認

```bash
# ヘルスチェック
curl http://localhost:4003/health

# ユーザー一覧（最初は空配列）
curl http://localhost:4003/users

# ユーザー作成
curl -X POST http://localhost:4003/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "age": 25
  }'

# ユーザー一覧（作成したユーザーが表示される）
curl http://localhost:4003/users
```

## よく使うコマンド

```bash
# ログ確認
docker compose logs -f app

# 停止
docker compose down

# 再起動
docker compose restart

# MySQLに接続
docker compose exec db mysql -u nestjs_user -pnestjs_password nestjs_db
```

## ポート番号

- **API**: http://localhost:4003
- **MySQL**: localhost:3308

詳細は `README.md` を参照してください。

