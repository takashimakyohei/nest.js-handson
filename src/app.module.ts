import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './database/database.config';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    // 環境変数の読み込み
    ConfigModule.forRoot({ isGlobal: true, }),
    // TypeORM設定
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig, }),

    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

