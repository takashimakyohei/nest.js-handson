# NestJS Hands-on 🚀

NestJS + TypeScript + Docker + MySQL + TypeORM を使用したハンズオンプロジェクトです。

## 📋 目次

1. [環境構築](#環境構築)
2. [プロジェクト構成](#プロジェクト構成)
3. [基本概念](#基本概念)
4. [ハンズオン実践](#ハンズオン実践)
5. [API仕様](#api仕様)
6. [よく使うコマンド](#よく使うコマンド)

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

### 停止・再起動

```bash
# 停止
docker compose down

# 再起動
docker compose restart

# ログ確認
docker compose logs -f app

# MySQLに接続
docker compose exec db mysql -u nestjs_user -pnestjs_password nestjs_db
```

---

## 📁 プロジェクト構成

```
nestjs-handson/
├── docker-compose.yml          # Docker Compose設定
├── Dockerfile                  # 本番用Dockerfile
├── Dockerfile.dev              # 開発用Dockerfile
├── package.json                # 依存関係
├── tsconfig.json               # TypeScript設定
├── nest-cli.json               # NestJS CLI設定
├── .env                        # 環境変数
└── src/
    ├── main.ts                 # エントリーポイント
    ├── app.module.ts           # ルートモジュール
    ├── app.controller.ts       # ルートコントローラー
    ├── app.service.ts          # ルートサービス
    ├── database/
    │   └── database.config.ts  # DB設定
    └── users/
        ├── users.module.ts     # Usersモジュール
        ├── users.controller.ts # UsersコントローラーHTTPリクエストを処理）
        ├── users.service.ts    # Usersサービス（ビジネスロジック）
        ├── user.entity.ts      # Userエンティティ（DBテーブル定義）
        └── dto/
            ├── create-user.dto.ts  # 作成用DTO
            └── update-user.dto.ts  # 更新用DTO
```

---

## 🎓 基本概念

### NestJSの主要な概念

#### 1. **Module（モジュール）**
- 機能をグループ化する単位
- `@Module()` デコレータで定義
- 例: `UsersModule`, `AppModule`

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

#### 2. **Controller（コントローラー）**
- HTTPリクエストを受け取り、レスポンスを返す
- `@Controller()` デコレータで定義
- ルーティングを担当

```typescript
@Controller('users')
export class UsersController {
  @Get()
  findAll() { ... }

  @Post()
  create(@Body() dto: CreateUserDto) { ... }
}
```

#### 3. **Service（サービス）**
- ビジネスロジックを実装
- `@Injectable()` デコレータで定義
- DIコンテナで管理される

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
}
```

#### 4. **Entity（エンティティ）**
- データベーステーブルの定義
- TypeORMのデコレータを使用

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
}
```

#### 5. **DTO（Data Transfer Object）**
- データ転送オブジェクト
- バリデーションルールを定義

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
```

### Dependency Injection（DI）
NestJSの核となる機能。コンストラクタで依存関係を注入します。

```typescript
constructor(private readonly usersService: UsersService) {}
```

---

## 🎯 ハンズオン実践

### Step 1: 基本のAPI動作確認

```bash
# ヘルスチェック
curl http://localhost:4003/health

# ユーザー一覧取得（最初は空）
curl http://localhost:4003/users
```

### Step 2: ユーザーを作成

```bash
# ユーザー作成
curl -X POST http://localhost:4003/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "age": 30
  }'

# もう一人作成
curl -X POST http://localhost:4003/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "name": "Jane Smith",
    "age": 25,
    "isActive": true
  }'
```

### Step 3: ユーザーを取得

```bash
# 全ユーザー取得
curl http://localhost:4003/users

# IDで取得
curl http://localhost:4003/users/1

# アクティブなユーザーのみ
curl http://localhost:4003/users/active
```

### Step 4: ユーザーを更新

```bash
# ユーザー情報更新
curl -X PUT http://localhost:4003/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "age": 31
  }'
```

### Step 5: ユーザーを削除

```bash
# ユーザー削除
curl -X DELETE http://localhost:4003/users/1
```

### Step 6: バリデーションを確認

```bash
# 無効なメールアドレス（エラーになる）
curl -X POST http://localhost:4003/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "name": "Test User"
  }'

# 重複メール（エラーになる）
curl -X POST http://localhost:4003/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "name": "Another Jane"
  }'
```

### Step 7: データベースを直接確認

```bash
# MySQLコンテナに接続
docker compose exec db mysql -u nestjs_user -pnestjs_password nestjs_db

# SQL実行
mysql> SELECT * FROM users;
mysql> DESCRIBE users;
mysql> exit;
```

---

## 📚 API仕様

### Base URL
```
http://localhost:4003
```

### Endpoints

#### 1. ヘルスチェック
```
GET /health
```

#### 2. 全ユーザー取得
```
GET /users
```

**Response:**
```json
[
  {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "age": 30,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 3. アクティブなユーザー取得
```
GET /users/active
```

#### 4. IDでユーザー取得
```
GET /users/:id
```

#### 5. ユーザー作成
```
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "age": 25,          // オプション
  "isActive": true    // オプション、デフォルトtrue
}
```

#### 6. ユーザー更新
```
PUT /users/:id
Content-Type: application/json

{
  "email": "new@example.com",  // オプション
  "name": "New Name",          // オプション
  "age": 30,                   // オプション
  "isActive": false            // オプション
}
```

#### 7. ユーザー削除
```
DELETE /users/:id
```

### エラーレスポンス

```json
{
  "statusCode": 404,
  "message": "User with ID 999 not found",
  "error": "Not Found"
}
```

---

## 🔧 よく使うコマンド

### Docker関連

```bash
# 起動
docker compose up -d

# ビルドして起動
docker compose up -d --build

# 停止
docker compose down

# ログ確認
docker compose logs -f app

# コンテナに入る
docker compose exec app sh

# MySQL接続
docker compose exec db mysql -u nestjs_user -pnestjs_password nestjs_db
```

### NestJS CLI（コンテナ内で実行）

```bash
# コンテナ内でシェルを起動
docker compose exec app sh

# 新しいモジュール作成
nest generate module products

# 新しいコントローラー作成
nest generate controller products

# 新しいサービス作成
nest generate service products

# 新しいリソース一式作成（CRUD）
nest generate resource products
```

---

## 🎨 カスタマイズ例

### 新しいエンドポイントを追加

**例: ユーザーの検索機能を追加**

1. **users.service.ts** にメソッド追加

```typescript
async searchByName(name: string): Promise<User[]> {
  return await this.usersRepository
    .createQueryBuilder('user')
    .where('user.name LIKE :name', { name: `%${name}%` })
    .getMany();
}
```

2. **users.controller.ts** にエンドポイント追加

```typescript
@Get('search/:name')
async search(@Param('name') name: string): Promise<User[]> {
  return await this.usersService.searchByName(name);
}
```

3. テスト

```bash
curl http://localhost:4003/users/search/john
```

---

## 🐛 トラブルシューティング

### ポートが使用中
```bash
# ポート使用状況確認
lsof -i :4003
lsof -i :3308

# .envファイルでポート変更
PORT=4004
```

### データベース接続エラー
```bash
# コンテナの状態確認
docker compose ps

# DBコンテナのログ確認
docker compose logs db

# 再起動
docker compose restart db
```

### ホットリロードが効かない
```bash
# コンテナを再ビルド
docker compose down
docker compose up -d --build
```

---

## 📖 学習リソース

- [NestJS 公式ドキュメント](https://docs.nestjs.com/)
- [TypeORM 公式ドキュメント](https://typeorm.io/)
- [NestJS日本語ドキュメント](https://zenn.dev/kisihara_c/books/nest-officialdoc-jp)

---

## 次のステップ

1. **認証機能を追加**: JWT, Passport
2. **他のテーブルとリレーション**: Posts, Comments など
3. **テストを書く**: Jest, Supertest
4. **Swagger追加**: API ドキュメント自動生成
5. **本番デプロイ**: AWS, GCP, Heroku

Happy Coding! 🎉

