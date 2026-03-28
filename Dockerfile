FROM node:20-alpine

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースをコピー
COPY . .

# ビルド
RUN npm run build

# ポート公開
EXPOSE 4003

# アプリケーション起動
CMD ["npm", "run", "start:prod"]

